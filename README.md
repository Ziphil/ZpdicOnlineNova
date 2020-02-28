<div align="center">
<h1>ZpDIC Online Nova</h1>
</div>


## 概要
[ZpDIC](http://ziphil.com/application/download/2.html) の Web アプリ版です。
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

## 起動 (開発時)
以下のコマンドを実行してください。
```
npm run develop
```
ポート番号 8050 と 3000 でそれぞれ Express と React のサーバーが起動します。
ブラウザから `http://localhost:3000` にアクセスすると、React のトップページが表示されます。
この状態では、各種スクリプトファイルを編集すると、自動的にファイルがコンパイルされるようになっています。

## 起動 (本番時)
まだやってないのでよく分かりません。

## 参考文献など
開発にあたって、以下のページを参考にしました。
今後のために記録しておきます。

- [React と Express を共存させる構成例](https://github.com/fractalliter/express-react-typescript)
- [React と Express によるログイン認証](https://weblion303.net/1215/)
- [簡単に HTTP リクエストを送れる GUI ツール](https://www.postman.com/)