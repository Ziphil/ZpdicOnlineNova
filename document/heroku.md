## 環境構築

### Heroku に登録
まず、[Heroku](https://heroku.com/) のアカウントを作成してログインします。
[ダッシュボード](https://dashboard.heroku.com)にアクセスし、適当な名前でアプリケーションを作成します。
ダッシュボードに作成したアプリケーションが追加されるので、それをクリックしてアプリケーションの設定画面に移動します。

これとは別に、ユーザーの設定画面から支払い方法を設定しておきます。
この設定は、MongoDB アドオンを用いるのに (たとえ無料プランを使う場合でも) 必要になります。

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

- 「Resource」タブの「Add-ons」欄に「mLab MongoDB」と入力して選択
- 料金プランを選択して「Provision」ボタンをクリック

この操作を行うと、自動的に MongoDB の URI が環境変数に設定されます。
「Setting」タブの「Config Vars」欄で、「MONGODB_URI」という名前の環境変数が設定されていれば問題ありません。

### ドメイン設定
無料プランでもできました。
すぐには反映されないので、気長に待ちます。

## デプロイ
GitHub の master ブランチにプッシュすると自動的にデプロイされます。

## 参考文献など
以下のページを参考にしました。

- [GitHub から Heroku へデプロイする方法](https://qiita.com/sho7650/items/ebd87c5dc2c4c7abb8f0)
- [お名前.com のドメインを Heroku に設定する方法](https://qiita.com/ozin/items/62bc7ef1dd3c827177fb)