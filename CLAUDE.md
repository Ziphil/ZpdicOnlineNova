# CLAUDE.md


## プロジェクト概要
**ZpDIC Online (Version 3)** — 人工言語の辞書を閲覧・作成できる Web アプリ (デプロイ場所: `http://zpdic.ziphil.com`)。

開発状況は [Notion の開発ダッシュボード](https://ziphil.notion.site/ZpDIC-Online-version-3-d044b0bb27c3486a80a22e291fe99062)で管理されている。

## 技術スタック
- **言語** — TypeScript (strict, `target: es5`, `module: commonjs`)
- **フロント** — React 18, Recoil, react-query, react-router-dom v6, react-hook-form, react-intl
  - **UI コンポーネントライブラリ** — Zographia (作者自作, `zographia` パッケージ)
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

実行環境は Node 20.18.0, npm 10.8.2 を想定。
別途 MongoDB のローカル起動が必要。

環境変数はリポジトリトップの `variable.env` と KeePassXC から読み込まれる ([document/variable.md](document/variable.md) 参照)。
具体的な環境変数の値は機密情報であるため、絶対に読み込もうとしないこと。

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
- **model** (`server/model/`) — Typegoose の `XxxSchema` クラス。`@prop` でフィールド定義、static/instance メソッドにビジネスロジック。`export type Xxx = DocumentType<XxxSchema>`、`export const XxxModel = getModelForClass(XxxSchema)` の形。
- **skeleton** (`server/internal/skeleton/`) — API でやり取りする**プレーンな DTO 型**。DB のドキュメント型とは別物。
- **creator** (`server/internal/creator/`) — model ↔ skeleton の変換。`skeletonize()` (model→DTO)と `enflesh()` (DTO→model) を提供する namespace。
- **controller** (`server/internal/controller/rest/`) — HTTP ハンドラ。

> ⚠️ **DB フィールド名と DTO のフィールド名はしばしば異なる** (例: 単語の綴りは model では `name`, skeleton では `spelling`)。
> 変換は必ず creator を通す。

#### REST コントローラの書き方
`@post("/processName")` のパスは型契約の **ProcessName** と一致させる。
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
`useRequest()` (命令的) と `useResponse()` / `useSuspenseResponse()` (react-query ベースの取得) を使う。
第 1 引数は ProcessName、第 2 引数は型付き request data。

## コーディング規約
詳細な規約は `.claude/rules/` に定義されており、**Claude Code はこれらを必ず守る**こと:

- @.claude/rules/typescript.md — 命名規則・TypeScript 共通スタイル (`*.ts`, `*.tsx`)
- @.claude/rules/react.md — React 関連スタイル (`client/**/*.tsx`, `client/**/*.yml`)
- @.claude/rules/css.md — SCSS スタイル (`client/**/*.scss`)

上記に加えてリポジトリ固有の慣習:

- ESLint は `eslint-config-ziphil`。コミット前に `npm run lint` で確認。
- コメント・ドキュメントは日本語。既存のスタイル (JSDoc 風の `/** ... */` でメソッドの意図を説明) に合わせる。
- 多くのファイル先頭に `//` だけの行がある (既存の慣習)。新規ファイルでもこれに倣う。
- 既存の命名・ファイル分割パターン (model, creator, skeleton, controller の 4 層) を踏襲する。

## 注意点
**機密ファイルは読み取り禁止**。
リポジトリトップの `variable.env` (環境変数) と `secret.ts` は機密情報を含む。
`Read` ツールでは `.claude/settings.json` の `deny` で遮断済みだが、`cat`, `Get-Content` 等の Bash 経由でも**絶対に内容を読み込まないこと**。

