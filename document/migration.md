## 概要
バージョンアップに伴い、想定するデータベース内のデータの構造が変更されることがあります。
このドキュメントには、特定のバージョンから特定のバージョンにアップデートするときに必要な処理が記載されています。
アップデート時に該当処理を行わなかった場合、データベースへのアクセスの際にエラーが発生したり、データを正しく取り出せなくなったりする可能性があります。

## 移行に必要な処理

### → ver 2.19.0
ver 2.19.0 以前からのマイグレーションには何らかの処理は必要ですが、行うべき処理の内容を忘れました。
新しく環境を構築し直してください。

### ver 2.19.1 → ver 2.20.0
Mongo Shell で該当のデータベースを選択した後、以下を実行してください。
```js
db.dictionaries.updateMany({}, {$rename: {"snoj": "settings.akrantiainSource"}});
```

### ver 2.22.9 → ver 2.23.0
Mongo Shell で該当のデータベースを選択した後、以下を実行してください。
```js
db.dictionaries.updateMany({}, {$set: {"settings.exampleTitle": "Examples"}});
```

### ver 2.30.0 → ver 2.31.0
ユーザーのメールアドレスを照合するようにし、照合済みかどうかを `activated` プロパティで保持するように変更しました。
すでに存在する全てのユーザーを照合済みとしたい場合は、Mongo Shell で該当のデータベースを選択した後、以下を実行してください。
```js
db.users.updateMany({}, {$set: {"activated": true}});
```

ユーザーごとに照合済みかどうかを変えたい場合は、個別に `activated` プロパティの設定をしてください。
ただし、全てのユーザーが `activated` プロパティをもつようにしてください。

### ver 2.38.0 → ver 2.39.0
Mongo Shell で該当のデータベースを選択した後、以下を実行してください。
```js
db.dictionaries.updateMany({}, {$set: {"settings.enableDuplicateName": true}});
db.words.updateMany({}, [{$set: {
  "equivalents": {$map: {
    input: "$equivalents",
    in: {"titles": ["$$this.title"], "names": "$$this.names"}
  }}
}}]);
db.words.updateMany({}, [{$set: {
  "relations": {$map: {
    input: "$relations",
    in: {"titles": ["$$this.title"], "number": "$$this.number", "name": "$$this.name"}
  }}
}}]);
```

### → ver 3.4.0
Mongo Shell で該当のデータベースを選択した後、以下を実行してください。
```js
db.exampleOffers.updateMany({}, {$rename: {
  "position.name": "catalog",
  "position.index": "number"
}});
db.exampleOffers.updateMany({}, {$inc: {"number": 1}});
db.exampleOffers.updateMany({}, {$set: {"author": "ZpDIC Online"}});

db.dictionaries.updateMany({"secret": false}, {$set: {"visibility": "public"}});
db.dictionaries.updateMany({"secret": true}, {$set: {"visibility": "unlisted"}});
```

### → ver 3.10.0
Mongo Shell で該当のデータベースを選択した後、以下を実行してください。
```js
db.examples.aggregate([
  {$match: {
    "offer": {$ne: null}
  }},
  {$addFields: {
    "offerOld": "$offer"
  }},
  {$lookup: {
    from: "exampleOffers",
    localField: "offer",
    foreignField: "_id",
    as: "offer"
  }},
  {$addFields: {
    "offer": {$first: "$offer"}
  }},
  {$addFields: {
    "offer": {$cond: [
      {$ifNull: ["$offer", false]},
      {
        "catalog": "$offer.catalog",
        "number": "$offer.number",
      },
      null
    ]}
  }},
  {$merge: {into: "examples"}}
])
```

### → ver 3.12.0
Mongo Shell で該当のデータベースを選択した後、以下を実行してください。
```js
db.dictionaries.updateMany({}, {$set: {"settings.showEquivalentNumber": false}});
```

### → ver 3.18.0
Mongo Shell で該当のデータベースを選択した後、以下を実行してください。
```js
db.words.updateMany({}, [{$set: {
  "sections": [{
    "equivalents": "$equivalents",
    "informations": "$informations",
    "phrases": "$phrases",
    "variations": "$variations",
    "relations": "$relations"
  }]
}}])
db.dictionaries.updateMany({"settings.templateWords": {$exists: true}}, [{$set: {
  "settings.templateWords": {$map: {
    input: "$settings.templateWords",
    in: {
      "title": "$$this.title",
      "name": "$$this.name",
      "pronunciation": "$$this.pronunciation",
      "tags": "$$this.tags",
      "sections": [{
        "equivalents": "$$this.equivalents",
        "informations": "$$this.informations",
        "phrases": "$$this.phrases",
        "variations": "$$this.variations",
        "relations": "$$this.relations"
      }]
    }
  }}
}}])
```