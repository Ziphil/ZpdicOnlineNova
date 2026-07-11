---
name: maintain-indexes
description: サーバーサイドの MongoDB インデックスをクエリの使用状況に合わせて整備する手順。「インデックスを整備して」「インデックスを見直して」「必要なインデックスを追加して」「不要なインデックスを削除して」「クエリとインデックスを同期して」など、MongoDB のインデックスの整備・見直しに関する依頼が出たら必ずこの skill を使うこと。server 内の全クエリ呼び出しを棚卸しし、Typegoose の @index 宣言と突き合わせて、新たに必要になったインデックスの追加と不要になったインデックスの削除を行い、develop から切ったブランチで PR を作成する。@index の削除は DB からは自動では消えないため、手動 dropIndex 用のコマンドを PR に記載する。
---

# MongoDB インデックスの整備手順


サーバーサイドのコード変更によってクエリの使用状況が変わった際に、Typegoose の `@index` 宣言をそれに追従させる。
整備内容は次の 2 点。

- **追加** — コード内のクエリが必要としているのに `@index` 宣言がないインデックスを追加する。
- **削除** — 対応するクエリがなくなった、もしくは他のインデックスと冗長になった `@index` 宣言を削除する。

## 必ず守るべき事項
- **コードの変更はインデックスの設定 or 削除のみの範囲で行い、アプリの挙動を変えないこと**。
  フィルタ条件・検索対象フィールド・limit などのクエリ本体や、モデルのフィールド定義・ビジネスロジックには一切手を入れない。
- **ただし、タイブレーカーの意味合いがある `_id` ソートキーの方向のみ、最適化のために変更しても良い** (方向混在のソートはインデックスで処理できないため, 詳細は Step 5)。
  この場合も、同順位のドキュメントの並び順以外の挙動が変わらないことを確認する。

## 前提知識
- **DB アクセスは `server/model/` に集約されている**。
  クエリの棚卸しはこのフォルダ (+ `server/util/query.ts`) を見れば全量を把握できる。
- **インデックス定義の正はコード** (`@index` デコレータと `@prop` の `unique: true`)。
  反映は Mongoose の `autoIndex` (サーバー起動時の `createIndex`) に任せる方針。
- **`autoIndex` は作成しかしない**。
  `@index` を削除しても DB のインデックスは残るため、削除分は手動 `dropIndex` が必要 (Step 8 で PR に記載する)。
- `@prop` の `unique: true` はアカウント整合性等に関わるため、**このスキルでは追加も削除もしない** (見直しが必要そうなら報告のみ行う)。

## 全体の流れ
1. 事前確認 (ブランチ・working tree・未マージ PR)
2. 整備用ブランチの作成
3. クエリの棚卸し
4. 既存インデックスの棚卸し
5. 差分の設計
6. 実装
7. 検証 (lint・型チェック)
8. 変更がなければ中止, あれば commit & PR
9. 手動確認事項の報告

## Step 1: 事前確認
```bash
git status
```

**確認する内容**:
- **`develop` ブランチにいること**を確認する。違う場合は中断してユーザーに報告する (勝手に切り替えない)。
- **working tree が clean であること**を確認する。未コミットの変更がある場合は中断して報告する。

この後で、さらに**未マージの整備ブランチがないこと**も確認する。
```bash
git ls-remote --heads origin 'maintenance/indexes-*'
```
本リポジトリは PR マージ時に head ブランチを自動削除する運用のため、ここに残っているのは**未マージの整備ブランチだけ**になる。
1 つでも出力されたら、前回の整備 PR がまだマージされていないので、**ここで中断し、その PR を先にマージもしくはクローズするようユーザーに促す**。
保険として、出力された各ブランチが `git merge-base --is-ancestor origin/<branch> origin/develop` でマージ済みかどうかを確認し、マージ済みのものは無視して良い。

## Step 2: 整備用ブランチの作成
`develop` から整備用のブランチを切る。
ブランチ名は `maintenance/indexes-<yyyymmdd>` 形式。
`<yyyymmdd>` に入れる今日の日付は、**実行環境のタイムゾーンが JST とは限らないため、必ず JST を明示して取得する** (この日付は後続の PR タイトルでも使う)。
```bash
date '+%Y%m%d' --date='TZ="Asia/Tokyo" now'
git switch -c maintenance/indexes-<yyyymmdd>
```

## Step 3: クエリの棚卸し
`server/` 内の全クエリ呼び出しを洗い出し、コレクションごとに**フィルタ条件のフィールド (等価か範囲か)・ソートキー・呼び出し頻度の高い導線か**を一覧にする。

検出には次の grep を使う (`Grep` ツールで良い)。
```
\.(find|findOne|findById|aggregate|countDocuments|updateMany|deleteMany|deleteOne|distinct)\(
```

**見落としやすい箇所**:
- **検索クエリビルダ** — `server/model/word-parameter/`, `example-parameter/`, `dictionary-parameter/`, `example-offer-parameter/`。
  `createKeys` が検索対象フィールドの全列挙、`createSortKey` がソートキーの全列挙になっているので、必ず両方を確認する。
- **ページングの count** — `server/util/query.ts` の `restrictWithSize` は、一覧取得のたびに**同じフィルタで `countDocuments` も実行する**。
  一覧系クエリはインデックスの恩恵が二重になる。
- **serializer** — `server/model/dictionary/serializer/` に cursor ベースの全件取得がある。
- `.where("キー", 値)` チェーン形式が主流なので、grep 結果の前後を読んでフィルタの全体像を把握する。
- `populate` は `_id` 参照なのでインデックス不要。

## Step 4: 既存インデックスの棚卸し
現在宣言されているインデックスを洗い出す。
`@index\(|unique:\s*true` を `server/model/` で grep し、コレクションごとの既存インデックス一覧を作る。

## Step 5: 差分の設計
Step 3 と Step 4 を突き合わせ、追加・削除するインデックスを決める。

**設計原則**:
- **ESR ルール** — 複合インデックスは Equality (等価条件) → Sort (ソートキー) → Range (範囲条件) の順に並べる。
- **プレフィックスルール** — `{a, b}` のインデックスは `{a}` だけのクエリもカバーする。冗長なインデックスは統合する (削除候補の判定にも使う)。
- **辞書スコープパターン** — `words`, `examples`, `articles` などの主要コレクションは `dictionary` の等価条件で始まるクエリが大半。「`{dictionary, ...}` で始まる複合インデックス」が基本形。
- **優先度はコレクションサイズ × 呼び出し頻度で判断する**。特に `words` と `old～` 系 (`oldWords`, `oldExamples`) が大きい。`notifications`, `systems` のような小さいコレクションには張らない。
- **サイズが数百件程度のコレクション** (`dictionaries`, `users`, `members` など) でも、リクエストごとに走るクエリ (権限チェック・URL 解決など) はインデックス対象とする。

**このリポジトリ特有の注意点** (過去の設計判断):
- **case-insensitive 正規表現 (`i` フラグ) はインデックスの範囲スキャンに落ちない**。
  単語・用例検索の needle は大半がこれなので、検索クエリの方針は「`dictionary` 等価で 1 辞書分に絞る + ソートをインデックスで賄う + 正規表現は残余フィルタ」とする。
  検索フィールドごとのインデックスは張らない。
- **ソート方向の混在はインデックスで処理できない**。
  インデックスがソートに効くのは、ソート指定がキー方向と完全一致するか全キー一斉反転の場合のみ。
  `createSortKey` 系はタイブレーカー `_id` にも `directionSign` を付ける規約 (例: `` `${directionSign}name ${directionSign}_id` ``) になっているので、新しいソートキーを追加する際もこれを守る。
  方向混在のソートを見つけたら、インデックスを倍にするのではなく**コード側を直す**。
- **`{dictionary, number}` に unique 制約は付けない**。
  アップロード処理 (`insertMany`) がファイル由来のデータをそのまま挿入するため、不正なファイルで挿入全体が失敗するのを避ける。
- **任意フィールドの検索キーには `sparse: true`** を付ける (例: `dictionaries` の `paramName`)。

## Step 6: 実装
### 追加
対象モデルのスキーマクラスに `@index` デコレータを追加する。

**書き方の規約**:
- `@modelOptions` の直下にまとめて置く。
- **`@index` 内のプロパティ名 (オプション含む) は常にクオートする**。
  ```typescript
  @modelOptions({schemaOptions: {collection: "words"}})
  @index({"dictionary": 1, "number": 1})
  @index({"paramName": 1}, {"sparse": true})
  export class WordSchema {
  ```
- `index` のインポートは `@typegoose/typegoose` の既存インポートにアルファベット順で追加する (`getModelForClass` の後)。
- `"sections.relations.number"` のようなドット付きキーは ESLint の `@typescript-eslint/naming-convention` に引っかかる。
  その場合はファイル先頭の `//` 行を `/* eslint-disable @typescript-eslint/naming-convention */` に置き換える (`example.ts`, `word.ts` と同じ形式)。
  行単位の disable は使わない。

### 削除
不要になった `@index` の行を削除する。
削除したものは「コレクション名 + インデックスのキー定義」を控えておく (Step 8 の PR 本文で `dropIndex` コマンドとして案内する)。

## Step 7: 検証
```bash
npx eslint <変更したファイル...>
npx tsc --noEmit --skipLibCheck
```

**注意点**:
- `npm run lint` (全体) には既存の警告が含まれることがあるので、変更ファイルに新しい警告が出ていないことを確認する。
- `tsc` は `--skipLibCheck` を付けないと `node_modules` 内の既存の型エラーで失敗する (プロジェクトコードとは無関係)。

## Step 8: 変更がなければ中止, あれば commit & PR
### 変更が全くない場合 (クエリとインデックスがすでに同期していた場合)
整備の必要がなかった旨をユーザーに報告する。
その後、Step 2 で作ったブランチを破棄して `develop` に戻る。
```bash
git switch develop
git branch -D maintenance/indexes-<yyyymmdd>
```

これで終了 (PR は作らない)。

### 変更がある場合
変更をコミットする。
```bash
git add server/
git commit -m "クエリの使用状況に合わせてMongoDBのインデックスを変更"
```

ブランチを push して PR を作成する (base は `develop`)。
```bash
git push -u origin maintenance/indexes-<yyyymmdd>
gh pr create --base develop --title "インデックス整備: <yyyymmdd>" --body "<本文>"
```
PR 本文には次を含める (日本語)。
- 追加したインデックスの一覧 (コレクションごと) + 根拠となるクエリ
- 削除した `@index` の一覧と、mongosh 用の `db.<collection>.dropIndex({...})` コマンド
  - ユーザーが後からこれを実行して削除するため
- クエリ側のコードにも変更を入れた場合はその内容と挙動への影響

PR 作成後は作業ブランチを `develop` に戻して終了する。
```bash
git switch develop
```

## Step 9: 手動確認事項の報告
最後に、自動では対応しきれなかった項目をユーザーに報告する。
例えば:
- 削除したインデックスの手動 `dropIndex` が必要なこと (PR 本文にもあるが再掲する)。
- ローカル MongoDB での `explain("executionStats")` による効果検証は行っていないこと (`totalDocsExamined` と `nReturned` の比較で確認できる)。
- 反映後しばらくしてから `db.<collection>.aggregate([{$indexStats: {}}])` で実際に使われているかを確認し、使われていないインデックスは次回の整備で削除候補にすると良いこと。
- `unique: true` まわりで見直しが必要そうな点があればその報告。
