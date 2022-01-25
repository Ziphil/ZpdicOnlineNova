<div align="center">
<h1>ZpDIC Online (Version 2)</h1>
</div>

![](https://img.shields.io/github/package-json/v/Ziphil/ZpdicOnlineNova)
![](https://img.shields.io/github/commit-activity/y/Ziphil/ZpdicOnlineNova?label=commits)


## 概要
ZpDIC の Web アプリ版です。
デスクトップ版と比べ、造語依頼機能や複数ユーザーによる編集機能など、Web アプリならではの機能を重点的に実装しています。
アプリは[こちら](http://zpdic.ziphil.com/)で公開しています。

(*>△<) ＜応援ください!

## お問い合わせ
ZpDIC Online に関する開発状況や追加予定の機能などは、以下のダッシュボードをご覧ください。

- [開発ダッシュボード](https://ziphil.notion.site/ZpDIC-Online-987030f6505e4cf1ba8fe08121584d93)

ZpDIC Online に関するご意見やご要望は、ZpDIC Online 上の[お問い合わせフォーム](http://zpdic.ziphil.com/contact)から送信していただくか、このリポジトリにイシューとして追加してください。
どちらの方法を用いても、最終的に開発ダッシュボードの項目として追加され、今後の開発の参考にさせていただきます。

## コントリビューション
「needs help」タグが付けられたイシューについては、プルリクエストなどによる貢献を受け付けています。
詳細は各イシューのページをご覧ください。

- [貢献を求めるイシューの一覧](https://github.com/Ziphil/ZpdicOnlineNova/issues?q=is%3Aissue+is%3Aopen+label%3A%22needs+help%22)

## 使い方
以下は、環境構築やデプロイのために行うべき操作の概要です。
備忘録として残しておきます。

- [ローカル](document/local.md)
- [Heroku](document/heroku.md)

すでに ZpDIC Online を動かしていて、そのバージョンを最新のものに更新したい場合は、古いバージョンのデータと最新バージョンが想定するデータとの整合性をとるために、特定の前処理を行う必要がある場合があります。
これについては以下のドキュメントを参考にしてください。

- [マイグレーション](document/migration.md)

なお、これらのドキュメントの内容は備忘録にすぎず、クローンサイトの公開を推奨するものではありません。
管理者である Ziphil の許可を得ずに、このリポジトリのプログラムをそのままもしくはわずかだけを改変し、それを利用して Web アプリケーションを公開することを禁じます。