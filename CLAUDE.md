# CLAUDE.md


## プロジェクト概要
**ZpDIC Online (Version 3)** — 人工言語の辞書を閲覧・作成できる Web アプリ (デプロイ場所: `http://zpdic.ziphil.com`)。

開発状況は [Notion の開発ダッシュボード](https://ziphil.notion.site/ZpDIC-Online-version-3-d044b0bb27c3486a80a22e291fe99062)で管理されている。

## 技術スタック
- **言語** — TypeScript (strict, `target: es5`, `module: commonjs`)
- **フロント** — React 18, Recoil, react-query, react-router-dom v6, react-hook-form, react-intl
  - **UI コンポーネントライブラリ** — Zographia (作者自作, zographia パッケージ)
  - **スタイリング** — SCSS + react-css-modules (`.scss` を各コンポーネントに同梱)
- **サーバー** — Express, Socket.io, Agenda (ジョブスケジューラ)
  - ただし Socket.io は現状未使用
- **DB** — MongoDB (Mongoose + Typegoose)
- **ビルド** — webpack (クライアント・サーバーを別々にバンドル)
- **外部サービス** — AWS S3 (ファイル), SendGrid (メール), reCAPTCHA v3, Anthropic API (Claude), Font Awesome Pro

テストフレームワークは導入されていない。

## コマンド
| コマンド | 内容 |
|---|---|
| `npm run develop` | 開発サーバー起動 (クライアント `http://localhost:3000`, サーバー `8050`) |
| `npm run build` | 本番ビルド (lient → server → openapi の順) |
| `npm run start` | ビルド済みサーバーを起動 (`http://localhost:8050`) |
| `npm run lint`, `npm run lint:fix` | ESLint (`eslint-config-ziphil` ベース) |

`npm run develop` で開発サーバーを起動した場合、ブラウザでは `http://localhost:3000` を開いてください。

`npm run start:worker` (`worker/` 内のスクリプトを実行) も存在するが、現状ワーカーは未使用 (中身が空)。
当面はワーカーを用意する計画はない。

実行環境は Node 26, npm 12 を想定 (`mise.toml` と package.json の `engines` で管理)。
別途 MongoDB のローカル起動が必要。

環境変数はリポジトリトップの `variable.env` と KeePassXC から読み込まれる ([document/variable.md](document/variable.md) 参照)。
これらの注入はビルドコマンドやサーバー起動コマンドの内部で自動的に行われるため、Claude がその値を知る必要はない (「機密情報の扱い」の節を参照)。

## ディレクトリ構成
- **`client/`** — フロントエンド (React)
- **`server/`** — バックエンド (Express)
- **`worker/`** — バックグラウンドワーカーの別エントリポイント (現状未使用)
- **`loader/`** — webpack のカスタムローダー
- **`document/`** — 環境構築・デプロイ・マイグレーションの備忘録 (基本的に作者用, 普段は参照不要)

**パスエイリアス (tsconfig + webpack) の設定がある**。
`/client`, `/server`, `/worker` がリポジトリルートからの絶対インポートになる (例: `import {WordModel} from "/server/model"`)。
インポートは原則この形にする。

### サーバー構成 (`server/`)
API は 3 系統に分かれており、それぞれ `controller`, `creator`, `skeleton` (or `type`) を持つ:

- **`internal/`** — フロントエンドが叩く内部 API (`/internal/<version>/...`)。
- **`external-preview/`** — 公開 REST API v0 (`/api/v0`)。 OpenAPI 定義は `type/rest.yml` にある。
- **`external-alpha/`** — 公開 REST API v1 (`/api/v1`)。OpenAPI 定義は `type/rest.yml` にある。
- **`model/`** — Typegoose スキーマ + ドメインロジック (DB アクセスの本体)。
- **`language/`** — サーバー側 i18n (`ja.yml`, `en.yml`)。

#### 層の役割 (重要)
- **model** (`server/model/`) — Typegoose の `XxxSchema` クラス。`@prop` でフィールド定義、メソッドにビジネスロジック。`export type Xxx = DocumentType<XxxSchema>`、`export const XxxModel = getModelForClass(XxxSchema)` の形。
- **skeleton** (`server/internal/skeleton/`) — API でやり取りする**プレーンな DTO 型**。DB のドキュメント型とは別物。
- **creator** (`server/internal/creator/`) — model ↔ skeleton の変換。`skeletonize()` (model→DTO)と `enflesh()` (DTO→model) を提供する namespace。
- **controller** (`server/internal/controller/rest/`) — HTTP ハンドラ。

> ⚠️ **DB フィールド名と DTO のフィールド名はしばしば異なる** (例: 単語の綴りは model では `name`, skeleton では `spelling`)。
> 変換は必ず creator を通す。

#### REST コントローラの書き方
`@post("/processName")` のパスは型契約の **`ProcessName` と一致させる**。
ハンドラのメソッド名は `[Symbol()]` を使う (名前を持たせない)。
認証・辞書取得は `@before(checkMe(), checkDictionary("edit"))` のようにミドルウェアで宣言。
レスポンスは `InternalRestController.respond(response, body)`, `respondError`, `respondByCustomError`。

#### 型安全な API 契約
`server/internal/type/rest.ts` の `ServerSpecs` がフロント・サーバー共通の契約。
各エンドポイントを `{request, response: {success, error}}` で定義する。
**ここに追加すると `ProcessName`, `RequestData<N>`, `ResponseData<N>` が自動的に効き、クライアントの `useRequest`, `useResponse` でも型補完される**。
エンドポイントを増やすときは「ServerSpecs に型を足す → controller にハンドラを足す」をセットで行う。

### クライアント構成 (`client/`)
- **`component/`** — UI。粒度別に分類される。
  - **`atom/`** — 最小部品。
  - **`compound/`** — 複合コンポーネント。シンプルな UI 部品以外は基本的にここに格納する。
  - **`form/`** — (特に設定ページの) フォーム。
  - **`page/`** — ページ・パート。
  - **`core/`** — ルート系 (`Provider`, `Routing`, `Appearance`)。
  - 各コンポーネントは `xxx.tsx` + `xxx.scss` + `index.ts` で構成される。補助的に `xxx-hook.ts`, `xxx-loader.ts` を持つことも多い。
- **`hook/`** — カスタムフック (`request.ts` の `useRequest`/`useResponse`/`useSuspenseResponse` が API 呼び出しの中心)。
- **`util/`**, **`constant/`**, **`message/`** (i18n YAML)。

#### コンポーネントの書き方
`create()` (`client/component/create.ts`) でラップして定義する。
第 1 引数に `require("./xxx.scss")` (無ければ `null`)、第 2 引数に表示名、第 3 引数に関数コンポーネント。
`styleName` で CSS Modules のクラスを参照。
ref が要るものは `createWithRef` でラップする。

```tsx
export const Foo = create(
  require("./foo.scss"), "Foo",
  function ({bar, ...rest}: {bar: string} & AdditionalProps): ReactElement {
    const {trans} = useTrans("foo");
    return <div styleName="root" {...rest}>{trans("label")}</div>;
  }
);
```

#### API 呼び出し
`useRequest()` (命令的) もしくは `useResponse()`, `useSuspenseResponse()` (react-query ベースの取得) を使う。
第 1 引数は `ProcessName`、第 2 引数は型付き request data。

## コーディング規約
詳細な規約は `.claude/rules/` に定義されており、**Claude Code はこれらを必ず守る**こと:
- @.claude/rules/typescript.md — 命名規則・TypeScript 共通スタイル (`*.ts`, `*.tsx`)
- @.claude/rules/react.md — React 関連スタイル (`client/**/*.tsx`, `client/**/*.yml`)
- @.claude/rules/css.md — SCSS スタイル (`client/**/*.scss`)

上記に加えてリポジトリ固有の慣習:
- ESLint は `eslint-config-ziphil`。コミット前に `npm run lint` で確認。
- コメントは日本語。JSDoc 風の `/** ... */` でメソッドの意図を説明する形式だが、これは最低限に留める。指示がない限りコメントを付ける必要はない。
- 多くのファイル先頭に `//` だけの行がある (既存の慣習)。新規ファイルでもこれに倣う。
- 既存の命名・ファイル分割パターン (model, creator, skeleton, controller の 4 層) を踏襲する。

## 機密情報の扱い
基本方針は**機密情報の生の値を Claude の文脈に入れない**こと。
ここで言う文脈とは、会話ログ, 思考ログ, メモリ, コマンド出力, 生成したファイル, コミットメッセージなど、後から参照され得るもの全てを指す。
逆に言えば、値がコマンドのプロセス内部に留まり外に出てこない限りは問題ないので、**内部的に機密情報を読み込むだけのコマンドの実行は許可される**。

### 禁止 (値が文脈に入る操作)
- `*.env` ファイル (`variable.env` など) の内容を読んだり差分や断片を表示したりする。
- KeePassXC のデータベース (`*.kdbx`) やそのパスワードが保存されたファイルを読む。
- `keepassxc-cli` を直接実行する (出力そのものが機密情報になるため)。
- 環境変数の値を出力させる (`printenv`, `echo $DB_URI`, `node -e "console.log(process.env.X)"` など)。
  もし設定済みかどうかを確認したいだけなら、値ではなく真偽値や文字数のみを出力させること。
- 上記の方法で得た値を、ファイルやコミットやメモリ等に書き出す。

### 許可 (値がプロセス内部に留まる操作)
- `npm run build`, `npm run build:client`, `npm run build:server` などのビルドコマンド。
  `webpack-client.ts` が `multi-env-injector` 経由で `variable.env` と KeePassXC から環境変数を注入するが、注入されるのは変数名のログのみで値は出力されない。
  クライアントバンドルに埋め込まれるのも `EnvironmentPlugin` に列挙された公開情報 (`RECAPTCHA_KEY` などのサイトキー類) だけで、秘密鍵は含まれない。
- `npm run develop`, `npm run start` によるサーバー起動と、ブラウザを用いた動作確認。
- 上記コマンドの標準出力やエラー出力の確認。

### 出力に機密情報が現れてしまった場合
コマンドの出力に機密情報とおぼしき文字列 (API キーや認証情報を含む接続 URI など) が混ざっていた場合は、その部分を引用したり再出力したりせず、「出力に認証情報が含まれていた」とだけ報告すること。
そのような出力を含むログファイルをリポジトリ内に残さないこと。

## 注意点
git ワークツリーで作業していて、ワークツリーを使った作業の後片付け (クリーンアップ) を行う際は、**cleanup-worktree スキルの手順に従うこと**。
特に、ワークツリーフォルダ自身は (エディタにロックされて詰まるのを避けるため) 削除せず、手動削除を促す。
