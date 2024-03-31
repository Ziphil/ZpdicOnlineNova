## 環境構築

### Node.js のインストール
[Node.js](https://nodejs.org/ja) をインストールし、`npm` が呼び出せるように適切にパスを設定します。
以下を実行することで、npm のバージョンを確認できます。
これを書いている時点では ver 6.9.0 を使っています。
```
npm --version
```

### 依存パッケージの準備
必要な依存パッケージをインストールするため、ディレクトリのトップで以下を実行します。
同時にビルドも行われます。
```
npm install
```

### MongoDB のインストールと起動
[MongoDB](https://www.mongodb.com/download-center) をインストールします。
インストール先の `bin` フォルダにパスを通し、`mongo` や `mongod` などが呼び出せるようにしておきます。

以下のコマンドを実行することで、MongoDB を起動できます。
データベースのパスはたぶん何でも良いです。
とりあえず、今のところは `C:/Program Files/MongoDB/Data` として開発を進めています。
```
mongod --dbpath "(データベースのパス)"
```
MongoDB が起動すると、「connecting to」の後に MongoDB の URI が表示されるので、これをメモしておきます。
後で環境変数を設定する際に使用します。

起動時に「Attempted to create a lock file on a read-only directory」というエラーが出る場合は、フォルダのパーミッションを変更する必要があります。
Windows 10 であれば、以下の操作で変更できます。

- 該当フォルダの右クリックメニューから「プロパティ」を選択
- 「セキュリティ」タブの「編集」をクリック
- ウィンドウ上部のリストから現在ログインしているユーザーを選択
- ウィンドウ下部の「変更」の項目の「許可」の欄にチェックを入れる

### SendGrid への登録
[SendGrid](https://sendgrid.kke.co.jp) のアカウントを作成します。
Web API 用のアクセスキーを新たに作成し、メモしておきます。

### reCAPTCHA v3 への登録
[reCAPTCHA v3](https://www.google.com/recaptcha) にサイトを登録します。
サイトキーとシークレットキーを確認し、メモしておきます。

### Anthropic への登録
[Anthropic Console](https://console.anthropic.com/) のアカウントを作成します。
支払い方法などの設定をした後で、API キーを作成し、メモしておきます。

### Font Awesome への登録
[Font Awesome](https://fontawesome.com/) のアカウントを作成します。
Pro 以上のプランに加入した後で、パッケージトークンを作成し、メモしておきます。

### Amazon Web Service への登録
[Amazon Web Service](https://aws.amazon.com/jp) に登録し、ZpDIC Online で利用する IAM ユーザーを作成します。
このユーザーで API を利用するためのアクセスキーを新たに作成し、作成されたキー ID とシークレットキーを確認し、メモしておきます。
このユーザーのアクセス権限は、`AmazonS3FullAccess` ポリシーがあれば十分です。

マネジメントコンソールから S3 バケットを作成します。
作成したバケットのページに移動したら、「アクセス許可」タブを開きます。
まず、「ブロックパブリックアクセス」項目を編集し、全てのチェックボックスをオフにします。
さらに、「Cross-Origin Resource Sharing」項目を以下のように編集します。
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD", "POST", "PUT"],
    "AllowedOrigins": ["(ZpDIC Online を公開する URL)"],
    "ExposeHeaders": []
  }
]
```

### 環境変数の設定
[このドキュメント](variable.md)を参考にして、必要な環境変数の設定をしてください。
ディレクトリトップに `variable.env` がある場合はそれを読み込むようにしてあるので、このファイルを作成してそこに環境変数の定義を書いても構いません。

## 実行
環境構築後、以下のコマンドを実行してください。
```
npm run build
npm run start
```
ポート番号 8050 で Express のサーバーが起動するので、ブラウザから `http://localhost:8050` にアクセスすると ZpDIC Online のトップページが表示されます。

## 開発
ZpDIC Online を単に実行するだけではなく開発を行いたい場合は、代わりに以下のコマンドを実行してください。
```
npm run develop
```
ポート番号 8050 と 3000 でそれぞれ Express と React のサーバーが起動するので、ブラウザから `http://localhost:3000` にアクセスしてください。
この状態で各種スクリプトファイルを編集すると、自動的にファイルがコンパイルされ、ブラウザ上のページも更新されます。

## 参考文献
以下のページを参考にしました。

- [React と Express を共存させる構成例](https://github.com/fractalliter/express-react-typescript)
- [React と Express によるログイン認証](https://weblion303.net/1215)
- [深い階層の URL に直接遷移したときの 404 エラーの対処法](https://github.com/webpack/webpack-dev-server/issues/978)
- [認証情報を Local Storage に保存してはいけないことについて](https://techracho.bpsinc.jp/hachi8833/2019_10_09/80851)
- [簡単に HTTP リクエストを送れる GUI ツール](https://www.postman.com)
- [S3 に直接ファイルをアップロードする方法](https://devcenter.heroku.com/articles/s3-upload-node)