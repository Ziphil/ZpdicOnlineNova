## 環境構築

### Node.js のインストール
[Node.js](https://nodejs.org/ja) をインストールし、`npm` が呼び出せるように適切にパスを設定します。
以下を実行することで、npm のバージョンを確認できます。
これを書いている時点では ver 6.9.0 を使っています。
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

### 環境変数の設定
[このドキュメント](variable.md)を参考にして、必要な環境変数の設定をしてください。
ディレクトリトップに `variable.env` がある場合はそれを読み込むようにしてあるので、このファイルを作成してそこに環境変数の定義を書いても構いません。

## 開発
環境構築後、以下のコマンドを実行してください。
```
npm run develop
```
ポート番号 8050 と 3000 でそれぞれ Express と React のサーバーが起動します。
ブラウザから `http://localhost:3000` にアクセスすると、React のトップページが表示されます。
この状態で、各種スクリプトファイルを編集すると、自動的にファイルがコンパイルされ、ブラウザのページも更新されます。

## 参考文献
以下のページを参考にしました。

- [React と Express を共存させる構成例](https://github.com/fractalliter/express-react-typescript)
- [React と Express によるログイン認証](https://weblion303.net/1215)
- [深い階層の URL に直接遷移したときの 404 エラーの対処法](https://github.com/webpack/webpack-dev-server/issues/978)
- [認証情報を Local Storage に保存してはいけないことについて](https://techracho.bpsinc.jp/hachi8833/2019_10_09/80851)
- [簡単に HTTP リクエストを送れる GUI ツール](https://www.postman.com)