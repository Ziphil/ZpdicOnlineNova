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

### スケジューラの設定
ZpDIC Online では、造語数履歴などを保存するため、定期的に特定の処理を実行する必要があります。
該当処理は npm scripts として実行できるようになっているので、スケジューラなどを利用してこれを定期的に実行してください。
以下は Heroku Scheduler を用いて定期実行する場合の設定方法です。

「Resources」タブの「Add-ons」欄から、アドオンとして Heroku Scheduler を追加します。
管理画面に移動したら以下の操作を行います。

- 「Add Jobs」ボタンをクリックしてジョブ作成フォームを開く
- 「Schedule」欄のプルダウンメニューから「Every day at」を選択し、時刻として「2:30 PM UTC」に設定
- 「Run Command」欄に `npm run start:service -- history` と入力

## デプロイ
GitHub の master ブランチにプッシュすると自動的にデプロイされます。

## 参考文献など
以下のページを参考にしました。

- [GitHub から Heroku へデプロイする方法](https://qiita.com/sho7650/items/ebd87c5dc2c4c7abb8f0)
- [お名前.com のドメインを Heroku に設定する方法](https://qiita.com/ozin/items/62bc7ef1dd3c827177fb)