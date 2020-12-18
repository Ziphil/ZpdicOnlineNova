## 概要
バージョンアップに伴い、想定するデータベース内のデータの構造が変更されることがあります。
このドキュメントには、特定のバージョンから特定のバージョンにアップデートするときに必要な処理が記載されています。
アップデート時に該当処理を行わなかった場合、データベースへのアクセスの際にエラーが発生したり、データを正しく取り出せなくなったりする可能性があります。

## 移行に必要な処理

### ver 2.19.x → ver 2.20.0
Mongo Shell で該当のデータベースを選択した後、以下を実行してください。
```
db.dictionaries.updateMany({}, {$rename: {"snoj": "settings.akrantiainSource"}});
```

### ver 2.22.x → ver 2.23.0
Mongo Shell で該当のデータベースを選択した後、以下を実行してください。
```
db.dictionaries.updateMany({}, {$set: {"settings.exampleTitle": "Examples"}});
```