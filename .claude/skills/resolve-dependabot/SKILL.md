---
name: resolve-dependabot
description: dependabot が作成した依存パッケージ更新の PR をまとめて調査・マージするための手順。「dependabot の PR を見て」「dependabot の PR をマージして」「依存パッケージの更新をまとめて処理して」「dependabot を片付けて」「依存関係の更新 PR を整理して」など、dependabot・依存パッケージ更新 PR の調査やマージに関する依頼が出たら必ずこの skill を使うこと。現在 open な dependabot PR を全て取得し、各更新がアプリ本体に与える影響を調査して表で提示し、ユーザーの選択に従って固定メッセージで squash マージし、最後にローカルへ反映する。
---

# dependabot PR の調査とマージ手順


dependabot が作成した依存パッケージ更新の PR を調査し、ユーザーの判断に従ってマージする。
現在 open になっている dependabot の PR を全て取得し、各更新がアプリ本体へ与える影響を調べて表にまとめて提示する。
その後ユーザーにマージ対象を選ばせ、選ばれた PR を**固定のコミットメッセージ**で squash マージし、最後にローカルの `develop` へ反映する。

マージ時のコミットメッセージは**固定の文言**を使う (後述)。
勝手に言い換えたり英語にしたりしないこと。

> ⚠️ **commit や push して良いのは「dependabot に従った `package.json` と `package-lock.json` の書き換え」だけ**。
> 更新に伴ってソースコードの修正 (設定ファイルの移行、breaking change への追従など) が必要になった場合、修正作業自体を頼まれていたとしても、その変更を**勝手に commit や push してはならない**。
> 修正はワークツリー上に留め、内容をユーザーに提示して、commit や push の可否を必ず確認すること。

## 前提
- 対象リポジトリは `ziphil/ZpdicOnlineNova` (GitHub ツールの `owner` = `ziphil`, `repo` = `zpdiconlinenova`)。
- dependabot PR のベースブランチは `develop`。
- GitHub 操作は `mcp__github__*` ツールを用いる (`gh` CLI は使わない)。

## 全体の流れ
1. dependabot の open PR を全て取得する
2. 各 PR の影響を調査する
3. 調査結果を表にまとめてユーザーに提示する
4. `AskUserQuestion` でマージ対象 (全て or 一部) を決めさせる
5. 選ばれた PR を固定メッセージで squash マージする (コンフリクト時は `@dependabot rebase` で追従)
6. ローカルの `develop` に pull (rebase) で反映する
7. ユーザーに報告する

マージ (Step 5) は外部 (origin) への反映を伴い取り消しが難しいので、必ず Step 4 の確認を経てから実行すること。

## Step 1: dependabot の open PR を取得
`mcp__github__search_pull_requests` で dependabot が作成した open PR を取得する。
```
query: "repo:ziphil/zpdiconlinenova is:pr is:open author:app/dependabot"
```

各 PR について、少なくとも以下を把握する。
- PR 番号
- タイトル (`Bump <package> from <old> to <new>` の形式が多い)
- head ブランチ (`dependabot/...`) と base ブランチ (`develop`)

**注意**: dependabot の PR 本文には長大な changelog や release notes が含まれるため、一覧取得の出力が大きくなりがちである。
一覧では番号・タイトル・ブランチだけを押さえ、本文の詳細は Step 2 で PR ごとに取得する。

open な dependabot PR が 1 件もない場合は、その旨をユーザーに報告して終了する。

## Step 2: 各 PR の影響調査
PR ごとに、その更新がアプリ本体に与える影響を調べる。
以下の観点を組み合わせて、影響度をユーザーが判断できる材料を揃える。

### 2-1: バージョン差分の種類
タイトルまたは PR 本文から、パッケージ名・旧バージョン・新バージョンを取得する。
semver (`X.Y.Z`) のどの桁が上がったかを見る。
- **patch** (`Z`) — 通常は後方互換のバグ修正 (影響小)
- **minor** (`Y`) — 後方互換の機能追加 (影響小〜中)
- **major** (`X`) — 破壊的変更を含み得る (要注意)

### 2-2: 直接依存か推移的依存か
`package.json` の `dependencies` と `devDependencies` を確認し、対象パッケージが**直接依存**か、それとも lockfile のみに現れる**推移的依存 (transitive)** かを判定する。
- **直接依存** — アプリのコードが直接使う可能性がある。影響を実際に確認する。
- **推移的依存** — 直接は使っておらず、他パッケージ経由。影響は限定的なことが多い。
- **`devDependencies`** — ビルド・開発時のみに使われ、本番の実行時挙動には影響しない。`dependencies` より影響は小さいと見なせる。

### 2-3: 本体コードでの利用箇所 (直接依存の場合)
直接依存のパッケージについては、`Grep` でインポート箇所を調べ、アプリのどこでどう使われているかを把握する。
```
import ... from "<package>"
require("<package>")
```

利用箇所が多かったり中核的な処理で使われていたりするものほど、更新の影響が大きい。

### 2-4: changelog と breaking change の確認
`mcp__github__pull_request_read` (`method: "get"`) で PR 本文を取得する。
dependabot の本文には changelog・release notes・commits・互換性スコア (compatibility score) が含まれる。
major 更新や、changelog に breaking change や deprecation の記載がある場合は、それを影響として明記する。

## Step 3: 調査結果を表にまとめて提示
各 PR について、調査結果を Markdown の表にまとめてユーザーに提示する。
最低限、以下の列を含める。
```
| PR | パッケージ | 旧 → 新 | 種別 | 影響 |
|---|---|---|---|---|
```

- **PR** — PR 番号 (例: `#145`)。
- **パッケージ** — パッケージ名。
- **旧 → 新** — バージョン (例: `0.7.4 → 0.7.5`)。あわせて semver の段階 (patch, minor, major) も分かるようにする。
- **種別** — 直接依存 or 推移的依存、`dependencies` or `devDependencies` の別。
- **影響** — 更新によるアプリ本体への影響の評価。破壊的変更の有無, 利用箇所, CI 状態などを踏まえた簡潔な所見。

影響が特に大きいか注意が必要な PR があれば、表の後に一言添えて注意を促す。

## Step 4: マージ対象を決めさせる
`AskUserQuestion` を用いて、どの PR をマージするかをユーザーに決めさせる。

質問は次の 2 択にする。
- **全てマージ** — 取得した全ての dependabot PR をマージする。
- **一部をマージ** — 一部だけマージする。

**一部をマージ**が選ばれた場合は、続けてユーザーにマージしたい PR の番号を返答してもらう (例: 「135 と 142」)。
ユーザーの返答で示された PR だけをマージ対象とする。

いずれの場合も、マージ対象の PR の一覧をユーザーの選択として確定させてから Step 5 に進む。

## Step 5: squash マージ
確定したマージ対象の PR を、1 件ずつ順番に squash マージする。
`mcp__github__merge_pull_request` を用いる。
```
merge_method: "squash"
commit_title:  "依存パッケージのバージョンをdependabotに従って変更"
commit_message: ""
```

**固定ルール**:
- `merge_method` は必ず `"squash"`。
- `commit_title` は内容によらず一律 `依存パッケージのバージョンをdependabotに従って変更` で固定。
- `commit_message` は空にして、dependabot の元コミット一覧などが本文に紛れ込まないようにする。

### コンフリクト・ビハインドへの対応
npm の dependabot PR はどれも `package-lock.json` を変更するため、1 件マージすると残りの PR が `develop` に対してコンフリクトやビハインドになることがある。

マージが失敗した (mergeable でない) PR については、以下の手順で `@dependabot rebase` により追従させる。
1. `mcp__github__add_issue_comment` でその PR に `@dependabot rebase` とコメントする (`issue_number` に PR 番号を渡す)。
   同じ PR に二重にコメントしない。
2. dependabot がブランチを rebase し直す (force-push する) のを待つ。
   数分かかることがある。
   foreground の `sleep` は使えないため、`Monitor` ツールで PR の mergeable 状態が整うのを待つか、一定間隔をおいて `mcp__github__pull_request_read` (`method: "get"`) を再取得して `mergeable` と `mergeable_state` を確認する。
3. mergeable になったら、改めて同じ固定メッセージで squash マージする。

`develop` が進んだだけでコンフリクトの無い (“behind”) PR は、GitHub 側のサーバーマージで問題なくマージできることも多い。
まず素直にマージを試み、失敗したときだけ上記の rebase 対応を行う。

追従を数回試みても mergeable にならない PR は、無理に処理しようとせず、その旨 (「dependabot の rebase 待ちのため未マージ」) を記録して次に進み、最後にまとめて報告する。

## Step 6: ローカルに反映
マージが一段落したら、ローカルの `develop` に取り込む。
```bash
git checkout develop
git pull --rebase origin develop
```

ワークツリーに未コミットの変更 (更新に伴うソースコードの修正など) がある場合でも、pull を通すためにそれを**勝手に commit してはならない**。
`git stash` で退避してから pull し、その後 `git stash pop` で戻すこと。
その変更を commit・push するかどうかは、内容をユーザーに提示して判断を仰ぐ。

### クラウド環境で実行中の場合
クラウド環境 (Claude Code on the web) では、セッションは自動生成された作業ブランチ (`claude/...`) 上で始まる。
この場合、作業ブランチ上に未コミットの変更が無いことを確認した上で、`develop` を最新に更新する。
```bash
git fetch origin develop
```

必要に応じて `develop` に切り替え、`origin/develop` に揃える。
作業ブランチに未コミットの変更がある等で安全に切り替えられない場合は、無理に切り替えず、`git fetch` のみ行ってユーザーにローカル反映を委ねる。

## Step 7: 最後の報告
以下をユーザーに報告して終了する。
- マージした PR の一覧 (番号・パッケージ)。
- rebase 待ち等でマージできなかった PR があれば、その一覧と理由。マージできなかった PR は、dependabot の rebase が終わってから再度この skill を実行すれば良い旨も添える。
- ローカルの `develop` への反映状況。
