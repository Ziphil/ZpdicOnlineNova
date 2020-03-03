<div align="center">
<h1>ZpDIC Online (Version 2)</h1>
</div>


## 概要
[ZpDIC](http://ziphil.com/application/download/2.html) の新しい Web アプリ版です。
正直、ちゃんと動くものができるまでモチベーションを保てるか分からないので、もしかしたら完成しないかもしれません。
あんまり期待しないでね。

## 環境構築 (ローカル)

### Node.js のインストール
[Node.js](https://nodejs.org/ja/) をインストールし、`npm` が呼び出せるように適切にパスを設定します。
以下を実行することで、npm のバージョンを確認できます。
これを書いている時点では ver 6.4.1 を使っています。
```
npm --version
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

起動時に「Attempted to create a lock file on a read-only directory」というエラーが出る場合は、フォルダのパーミッションを変更する必要があります。
Windows 10 であれば、以下の操作で変更できます。

- 該当フォルダの右クリックメニューから「プロパティ」を選択
- 「セキュリティ」タブの「編集」をクリック
- ウィンドウ上部のリストから現在ログインしているユーザーを選択
- ウィンドウ下部の「変更」の項目の「許可」の欄にチェックを入れる

### 依存パッケージの準備
必要な依存パッケージをインストールするため、ディレクトリのトップで以下を実行します。
```
npm install
```

## 起動 (ローカル)
以下のコマンドを実行してください。
```
npm run develop
```
ポート番号 8050 と 3000 でそれぞれ Express と React のサーバーが起動します。
ブラウザから `http://localhost:3000` にアクセスすると、React のトップページが表示されます。
この状態では、各種スクリプトファイルを編集すると、自動的にファイルがコンパイルされるようになっています。

## 環境構築 (サーバー)

### Heroku に登録
デプロイ先のサービスとして [Heroku](https://heroku.com/) を用いるので、アカウントを作成します。
[ダッシュボード](https://dashboard.heroku.com)にアクセスし、適当な名前でアプリケーションを作成します。
ダッシュボードに作成したアプリケーションが追加されるので、それをクリックしてアプリケーションの設定画面に移動します。

### Heroku と GitHub の連携
以下の順序で GitHub 連携を行います。
これを行っておくと、GitHub の特定のブランチにプッシュするだけで自動的にデプロイされます。

- 「Deploy」タブの「Deployment method」欄から「GitHub」を選択
- 下に追加される「Connect to GitHub」欄の「Connect to GitHub」ボタンをクリック
- 新しく表示されるウィンドウで GitHub アカウントを認証
- リポジトリを検索するダイアログに「ZpdicOnlineNova」(このリポジトリ) と入力して検索
- 見つかったリポジトリの横にある「Connect」ボタンをクリック
- 「Automatic deploys」欄の「Enable Automatic Deploys」ボタンをクリック

### MongoDB の設定
以下の順序で Heroku から MongoDB を使えるようにします。
なお、これは有料アドオンなので、(無料プランを使う場合でも) アカウント設定から支払い方法をあらかじめ設定しておく必要があります。

- 「Resource」タブの「Add-ons」欄に「mLab MongoDB」と入力して選択
- 料金プランを選択して「Provision」ボタンをクリック

## 起動 (サーバー)
GitHub 連携を行ったので、GitHub にプッシュするだけででデプロイされます。

## 参考文献など
開発にあたって、以下のページを参考にしました。
今後のために記録しておきます。

- [React と Express を共存させる構成例](https://github.com/fractalliter/express-react-typescript)
- [React と Express によるログイン認証](https://weblion303.net/1215/)
- [深い階層の URL に直接遷移したときの 404 エラーの対処法](https://github.com/webpack/webpack-dev-server/issues/978)
- [簡単に HTTP リクエストを送れる GUI ツール](https://www.postman.com/)
- [GitHub から Heroku へデプロイする方法](https://qiita.com/sho7650/items/ebd87c5dc2c4c7abb8f0)