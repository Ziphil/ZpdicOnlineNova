---
name: maintain-messages
description: client アプリの国際化メッセージファイル (client/message の ja.yml, en.yml, eo.yml) を整備する手順。「メッセージファイルを整備して」「未設定のメッセージを追加して」「メッセージを並び替えて」「国際化メッセージを整えて」など、メッセージファイルの整備・未設定メッセージの補完・並び替えに関する依頼が出たら必ずこの skill を使うこと。コードが参照しているのにメッセージファイルにないキーを検出して追加し (ja にあれば翻訳, なければ <NOT SET>)、各ファイルを toast→atom→compound→form→page→other のセクション順かつセクション内アルファベット順に並び替えた上で、develop から切ったブランチで PR を作成する。
---

# メッセージファイルの整備手順


client アプリの国際化メッセージファイル (`client/message/ja.yml`, `en.yml`, `eo.yml`) を整備する。
整備内容は次の 2 点。

1. **未設定メッセージの補完** — コード内で `useTrans` の `trans`, `transNode` が参照しているキーのうち、メッセージファイルにないものを追加する。
   - 追加する値は原則 `<NOT SET>` (後で手動または別途 Claude に依頼して実際のメッセージへ置き換えるためのマーカー)。
   - ただし **`ja.yml` にそのキーが既にある場合**は、**その日本語メッセージを翻訳した値**を `en.yml`, `eo.yml` に追加する (`<NOT SET>` ではなく)。
2. **並び替え** — 各ファイルを以下の規則に整える。
   - セクションは `toast` → `atom` → `compound` → `form` → `page` → `other` の順。各セクションは `# <セクション名>` のコメントで始まり、セクション間は空行 1 つで区切る。
   - `toast` 以外のセクション内は、ルートキー (コンポーネントフォルダ名に対応) を**アルファベット順**に並べる。
   - `toast` セクションは `success` → `error` の固定順。

これらの作業はほぼ専用スクリプトで行う。
スクリプトの場所は `.claude/skills/maintain-messages/scripts/`。

スクリプトは TypeScript で書かれており `ts-node` 経由で実行するが、**アプリ本体とは独立した最小限の依存 (`ts-node`, `typescript`, `yaml`) だけで動く**よう、`scripts/` フォルダに専用の `package.json` と `tsconfig.json` を持つ。
そのため**アプリ本体の `npm ci` は不要** (クラウド環境では Font Awesome Pro の認証が必要で `npm ci` が失敗するため実行しない)。
実行はすべて `scripts/` の `npm run` 経由で行う (型チェックで止まらないように 各 `npm script` 内で `--transpile-only` を付けている)。

## セクションの定義 (参考)
- **`toast`** — トーストに表示されるメッセージ (ルートキー `toast`)
- **`atom`, `compound`, `form`, `page`** — `client/component/<セクション名>/` 内のコンポーネントで使われるメッセージ
- **`other`** — 上記以外

ルートキーがどのセクションに属するかは、その名前空間 (`useTrans` の引数) が使われているコンポーネントのフォルダから自動判定される。
判定はスクリプトに任せる。

## 全体の流れ
0. スクリプト依存の準備 (初回・クラウド環境用)
1. 事前確認 (ブランチ・working tree・未マージ PR)
2. 整備用ブランチの作成
3. 未設定メッセージの検出 (レポート生成)
4. 未設定メッセージの追加 (翻訳・`<NOT SET>`)
5. 並び替えの実行
6. 確認 (YAML 妥当性・差分レビュー)
7. 変更がなければ中止, あれば commit & PR
8. 動的キー等の手動確認事項の報告

## Step 0: スクリプト依存の準備
スクリプトを動かすための依存 (`ts-node`, `typescript`, `yaml`) を `scripts/node_modules` に用意する。
アプリ本体の `npm install`, `npm ci` は**行わない** (Font Awesome Pro の認証が必要でクラウド環境では失敗するため)。
```bash
npm install --prefix .claude/skills/maintain-messages/scripts --no-save
```

**注意点**:
- `--prefix` を使う場合は **`--no-save` を必ず付ける**。付けないと親リポジトリが `file:` 依存として `scripts/package.json` に書き込まれてしまう。
- すでに `scripts/node_modules` があれば再実行は不要 (が実行しても冪等で数秒)。
- ローカルで既にアプリ全体の `node_modules` が入っている環境でも、このコマンドで問題ない (`scripts/node_modules` に隔離される)。

## Step 1: 事前確認
```bash
git status
```

**確認する内容**:
- **`develop` ブランチにいること**を確認する。違う場合は中断してユーザーに報告する (勝手に切り替えない)。
- **working tree が clean であること**を確認する。未コミットの変更がある場合は中断して報告する。

この後で、さらに**未マージの整備 PR がないこと**も確認する。
以下で `maintenance/messages-*` の open PR を調べる。
```bash
gh pr list --state open --base develop --json number,title,headRefName \
  --jq '.[] | select(.headRefName | startswith("maintenance/messages-")) | "#\(.number) \(.title) (\(.headRefName))"'
```
出力があれば、前回以前の整備 PR がまだマージされていない。
`develop` から切り直すと同じ変更を重複して PR 化してしまい、コンフリクトの原因になるので、**ここで中断し、その PR を先にマージもしくはクローズするようユーザーに促す**。

全て満たす場合のみ次に進む。

## Step 2: 整備用ブランチの作成
`develop` から整備用のブランチを切る。
ブランチ名は `maintenance/messages-<yyyymmdd>` 形式 (`<yyyymmdd>` は今日の日付, 例: `maintenance/messages-20260630`)。
```bash
git switch -c maintenance/messages-<yyyymmdd>
```

**注意点**:
- このスキルを 1 日に複数回実行することは想定していないため、日付付きのブランチ名で基本的に衝突しない。万一同名ブランチが既に存在する場合は、末尾に `-2` のような連番を付ける。
- まだ変更点がないか分からない段階だが、先にブランチを切ってから作業する。Step 7 で結局変更がなかった場合は、このブランチを破棄して `develop` に戻す。

## Step 3: 未設定メッセージの検出
レポート生成スクリプトを実行する (このスクリプトはファイルを書き換えない)。
```bash
npm --prefix .claude/skills/maintain-messages/scripts run check
```

**出力の読み方**:
- `[ja.yml] / [en.yml] / [eo.yml] 未設定のキー` — 各ファイルに追加が必要なキーの一覧。
  - `翻訳元(ja): "..."` と表示されたものは、`ja.yml` に既存の日本語メッセージがある。これを翻訳して追加する。
  - `→ <NOT SET> を設定` と表示されたものは、翻訳元がないので `<NOT SET>` を設定する。
  - `[新規ルートキー: <名前空間> / section=<セクション>]` と付いたものは、そのルートキー自体がそのファイルにまだ存在しない。
- `[スコープ未特定]` — `useTrans` のスコープを一意に特定できず解決できなかった参照。Step 8 で手動確認事項として報告する。
- 出力末尾の `===== JSON =====` 以降は同じ内容の機械可読版。必要に応じて参照する。

> テンプレートリテラルで動的に組み立てられるキー (例: `` trans(`label.${x}`) ``) は、自動解決できないためこのスキルの管理対象外。スクリプトは内部的に解析しているが、レポートには出力しない (通知しない)。

未設定のキーが 1 件もなく、かつ動的キー等も特に対応不要であれば、追加作業 (Step 4) はスキップして Step 5 に進む。

## Step 4: 未設定メッセージの追加
Step 3 のレポートに従い、各言語ファイルへ未設定のキーを追加する。
`Edit` ツールで編集する。

**値の決め方**:
- `ja.yml` に翻訳元がある (`翻訳元(ja)` 表示) 場合 — その日本語を**翻訳**して `en.yml` (英語), `eo.yml` (エスペラント) に追加する。
- 翻訳元がない場合 — `ja.yml` も含め、未設定の言語すべてに `<NOT SET>` を追加する。

**追加場所**:
- そのルートキー (名前空間) が既にファイルに存在する場合 → 既存のルートキーの下の、レポートのドット区切りパスが示す位置に、**正しいネスト**で追加する。
  - 例: `searchWordAdvancedDialog.discard.equivalent` → 既存の `searchWordAdvancedDialog:` 内の `discard:` の下に `equivalent: "<NOT SET>"` を追加。
- ルートキー自体がない (`[新規ルートキー: ...]`) 場合 → そのルートキーを新規に作る。**配置するセクションや並び順は気にしなくて良い** (Step 5 の並び替えで自動的に正しい位置へ移動する)。ファイル末尾付近など、YAML として妥当な場所に追加すればよい。

**注意点**:
- 既存メッセージの値や書式 (`|-`, `>-` などのブロックスカラー) は変更しない。追加するキーの書式は周囲の既存メッセージに合わせる。
- メッセージ内のネストの深さや親キーを間違えないこと。ドット区切りパスの通りに階層を作る。
- `<NOT SET>` はそのままの文字列 (`"<NOT SET>"` など周囲の引用スタイルに合わせる) で入れる。

## Step 5: 並び替えの実行
並び替えスクリプトを実行する (3 ファイルすべてを書き換える)。
```bash
npm --prefix .claude/skills/maintain-messages/scripts run reorder
```

このスクリプトは、各ファイルを以下のように整える。
- セクションを `toast` → `atom` → `compound` → `form` → `page` → `other` の順に並べ、`# <セクション名>` コメントとセクション間の空行を付け直す。
- `toast` 以外のセクション内のルートキーをアルファベット順に並べる。
  - ただし YAML のアンカー (`&`) / エイリアス (`*`) 依存は尊重し、エイリアスを使うルートキーは必ずアンカー定義側より後ろに配置する (`registerForm` → `issueUserResetTokenForm` / `resetUserPasswordForm` など)。厳密なアルファベット順より依存関係が優先される。
- `toast` セクション内は `success` → `error` の順にする。
- **各ルートキーの中身 (メッセージ本文や深いネストの順序) は一切変更しない**。ルートキー単位のブロックを並び替えるだけ。

## Step 6: 確認
並び替え後のファイルが壊れていないことと、意図しない変更がないことを確認する。
```bash
npm --prefix .claude/skills/maintain-messages/scripts run check
```

**確認内容**:
- 再度レポートを出し、Step 4 で追加したキーが「未設定」から消えていることを確認する (残っていれば追加場所が間違っている)。
- スクリプトはファイル読み込み時に YAML をパースするので、エラーなく実行できれば YAML としても妥当。

さらに差分を確認する。
```bash
git --no-pager diff --stat client/message/
```

**確認内容**:
- 並び替えのため差分は大きく見えるが、**追加したキー以外でメッセージ本文が変わっていないこと**を確認する。気になる場合は `git --no-pager diff client/message/<file>` で中身を確認する。

## Step 7: 変更がなければ中止, あれば commit & PR
```bash
git status --short client/message/
```

### 変更が全くない場合 (未設定キーもなく並び替えも不要だった場合)
- 整備の必要がなかった旨をユーザーに報告する。
- Step 2 で作ったブランチを破棄して `develop` に戻る。
  ```bash
  git switch develop
  git branch -D maintenance/messages-<yyyymmdd>
  ```
- これで終了 (PR は作らない)。

### 変更がある場合
- 変更をコミットする。
  ```bash
  git add client/message/
  git commit -m "メッセージファイルを体裁に則る形に変更"
  ```
- ブランチを push して PR を作成する (base は `develop`)。
  `<yyyymmdd>` の箇所は今日の日付を入れる。
  ```bash
  git push -u origin maintenance/messages-<yyyymmdd>
  gh pr create --base develop --title "メッセージファイル整備: <yyyymmdd>" --body "<本文>"
  ```
- PR 本文には次を含める (日本語)。
  - 未設定だったため追加したキーの一覧 (`<NOT SET>` で追加したものと翻訳して追加したものを区別して書く)
  - **`<NOT SET>` のままのキーは別途実際のメッセージに置き換える必要がある**旨
  - 並び替え (セクション順・アルファベット順) を行ったこと
- PR 作成後は作業ブランチを `develop` に戻して終了する (整備用ブランチは PR マージ後に削除されるのでここでは消さない)。
  ```bash
  git switch develop
  ```

## Step 8: 手動確認事項の報告
最後に、自動では対応しきれなかった項目をユーザーに報告する。
例えば:
- Step 3 のレポートに **`[スコープ未特定]`** の参照があれば、自動追加していないので、必要なら対応するメッセージが揃っているか手動で確認するよう促す。
- 追加した `<NOT SET>` の件数と、それらを実際のメッセージへ置き換える必要があること。
