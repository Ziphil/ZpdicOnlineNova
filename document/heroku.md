## 環境構築

### Heroku への登録
まず、[Heroku](https://heroku.com) のアカウントを作成してログインします。
[ダッシュボード](https://dashboard.heroku.com)にアクセスし、適当な名前でアプリケーションを作成します。
ダッシュボードに作成したアプリケーションが追加されるので、それをクリックしてアプリケーションの設定画面に移動します。

これとは別に、ユーザーの設定画面から支払い方法を設定しておきます。
この設定は、MongoDB アドオンを用いるのに (たとえ無料プランを使う場合でも) 必要になります。

### GitHub との連携
以下の順序で GitHub 連携を行います。
これを行っておくと、GitHub の特定のブランチにプッシュするだけで自動的にデプロイされます。

- 「Deploy」タブの「Deployment method」欄から「GitHub」を選択
- 下に追加される「Connect to GitHub」欄の「Connect to GitHub」ボタンをクリック
- 新しく表示されるウィンドウで GitHub アカウントを認証
- リポジトリを検索するダイアログに「ZpdicOnlineNova」(このリポジトリ) と入力して検索
- 見つかったリポジトリの横にある「Connect」ボタンをクリック
- 「Automatic deploys」欄の「Enable Automatic Deploys」ボタンをクリック

### 環境変数の設定
「Setting」タブの「Config Vars」欄で環境変数の設定を行います。
[このドキュメント](variable.md)を参考にして、必要な環境変数の設定をしてください。

## デプロイ
GitHub の master ブランチにプッシュすると自動的にデプロイされます。

## 参考文献など
以下のページを参考にしました。

- [GitHub から Heroku へデプロイする方法](https://qiita.com/sho7650/items/ebd87c5dc2c4c7abb8f0)
- [お名前.com のドメインを Heroku に設定する方法](https://qiita.com/ozin/items/62bc7ef1dd3c827177fb)