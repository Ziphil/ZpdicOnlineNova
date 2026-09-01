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

db.dictionaries.updateMany({}, {$rename: {"settings.font.type": "settings.font.kind"}});
```

### → ver 3.20.0
Mongo Shell で該当のデータベースを選択した後、以下を実行してください。
```js
db.dictionaries.updateMany({}, {$set: {"settings.enableProposal": true}});
```

### → ver 3.21.0
Mongo Shell で該当のデータベースを選択した後、以下を実行してください。
```js
db.dictionaries.updateMany({"settings.enableMarkdown": true}, {$set: {"settings.markdownFeatures": ["basic"]}});
db.dictionaries.updateMany({"settings.enableMarkdown": false}, {$set: {"settings.markdownFeatures": []}});

db.dictionaries.updateMany({}, {$set: {"settings.fontTargets": ["heading", "phrase", "variation", "relation", "example", "text"]}});
```

### → ver 3.25.0
API キーをユーザードキュメントの `apiKey` フィールドではなく、独立した `apiCredentials` コレクションで管理するように変更しました。
既存のユーザーがもつ `apiKey` を新しいコレクションに移行するため、Mongo Shell で該当のデータベースを選択した後、以下を実行してください。
```js
db.users.find({"apiKey": {$exists: true, $ne: null}}).forEach(function (user) {
  db.apiCredentials.insertOne({
    "user": user._id,
    "key": user.apiKey
  });
});
```

### → ver 3.26.0
辞書の共同編集者を、辞書ドキュメントの `editUsers` フィールドではなく、独立した `members` コレクションで管理するように変更しました。
既存の `editUsers` を新しいコレクションに移行するため、Mongo Shell で該当のデータベースを選択した後、以下を実行してください。
```js
db.dictionaries.find({"editUsers": {$exists: true}}).forEach(function (dictionary) {
  (dictionary.editUsers || []).forEach(function (userId) {
    db.members.insertOne({
      "dictionary": dictionary._id,
      "user": userId,
      "authority": "edit"
    });
  });
});
db.dictionaries.updateMany({}, {$unset: {"editUsers": ""}});
```

### → ver 3.27.0
各種データの論理削除方式を変更しました。
これまでは削除済みのデータもコレクション内に残して `removedDate` フィールドの有無で削除済みかどうかを判定していましたが、削除済みのデータを独立したコレクションに移動して管理するように変更しました。
これに伴い、各コレクション内に残っている削除済み (`removedDate` が設定されている) のデータを、それぞれ対応する削除済みデータ用コレクションに移動する必要があります。
この処理を行わなかった場合、削除済みのデータが通常のデータとして検索に表示されるようになってしまいます。
また、移動先のコレクションでは削除日時のフィールド名を `removedDate` から `deletedDate` に変更したため、移動時にフィールド名も変換します。
なお、辞書データについては、万が一の復元に備えて `_id` を保持したまま移動します (`$merge` は既定で `_id` を突き合わせるため、下記の処理で `_id` は維持されます)。
Mongo Shell で該当のデータベースを選択した後、以下を実行してください。
```js
db.words.aggregate([
  {$match: {"removedDate": {$exists: true, $ne: null}}},
  {$set: {"deletedDate": "$removedDate"}},
  {$unset: "removedDate"},
  {$merge: {into: "oldWords", whenMatched: "replace", whenNotMatched: "insert"}}
]);
db.words.deleteMany({"removedDate": {$exists: true, $ne: null}});

db.examples.aggregate([
  {$match: {"removedDate": {$exists: true, $ne: null}}},
  {$set: {"deletedDate": "$removedDate"}},
  {$unset: "removedDate"},
  {$merge: {into: "oldExamples", whenMatched: "replace", whenNotMatched: "insert"}}
]);
db.examples.deleteMany({"removedDate": {$exists: true, $ne: null}});

db.articles.aggregate([
  {$match: {"removedDate": {$exists: true, $ne: null}}},
  {$set: {"deletedDate": "$removedDate"}},
  {$unset: "removedDate"},
  {$merge: {into: "oldArticles", whenMatched: "replace", whenNotMatched: "insert"}}
]);
db.articles.deleteMany({"removedDate": {$exists: true, $ne: null}});

db.dictionaries.aggregate([
  {$match: {"removedDate": {$exists: true, $ne: null}}},
  {$set: {"deletedDate": "$removedDate"}},
  {$unset: "removedDate"},
  {$merge: {into: "oldDictionaries", whenMatched: "replace", whenNotMatched: "insert"}}
]);
db.dictionaries.deleteMany({"removedDate": {$exists: true, $ne: null}});
```

また、外部 API の呼び出し制限を API キーごとに設定できるように変更し、API キーデータに呼び出し制限を表す `limit` フィールド (1 分あたりの呼び出し回数の上限) を追加しました。
このフィールドは必須であり、値をもたない API キーによるリクエストはエラーになります。
既存の API キーに既定の呼び出し制限 (10 回) を設定するため、Mongo Shell で該当のデータベースを選択した後、以下を実行してください。
```js
db.apiCredentials.updateMany({"limit": {$exists: false}}, {$set: {"limit": 10}});
```

### → ver 3.28.0
辞書設定の `showEquivalentNumber` と `showSectionNumber` の型を、真偽値から `"show"`, `"onlyNecessary"`, `"hide"` の 3 値の文字列に変更しました。
これまでの `true` は `"show"` に、`false` は `"hide"` に対応します (`"onlyNecessary"` は「項目が複数あるときのみ表示する」を表す新設の値です)。
既存のデータを変換するため、Mongo Shell で該当のデータベースを選択した後、以下を実行してください。
なお、削除済み辞書の復元に備えて、`oldDictionaries` コレクションについても同様の変換を行います。
```js
db.dictionaries.updateMany({"settings.showEquivalentNumber": {$type: "bool"}}, [{$set: {
  "settings.showEquivalentNumber": {$cond: ["$settings.showEquivalentNumber", "show", "hide"]}
}}]);
db.dictionaries.updateMany({"settings.showSectionNumber": {$type: "bool"}}, [{$set: {
  "settings.showSectionNumber": {$cond: ["$settings.showSectionNumber", "show", "hide"]}
}}]);

db.oldDictionaries.updateMany({"settings.showEquivalentNumber": {$type: "bool"}}, [{$set: {
  "settings.showEquivalentNumber": {$cond: ["$settings.showEquivalentNumber", "show", "hide"]}
}}]);
db.oldDictionaries.updateMany({"settings.showSectionNumber": {$type: "bool"}}, [{$set: {
  "settings.showSectionNumber": {$cond: ["$settings.showSectionNumber", "show", "hide"]}
}}]);
```

### → ver 3.29.0
### 番号の払い出し方法の変更に伴う処理
辞書データに割り振り済みの最大番号を表す `maxNumbers` フィールド (`word`, `example`, `article` の 3 つの数値をもつオブジェクト) を追加し、実際に存在するデータとは独立に番号を管理するようにしました。
デプロイ前に、Mongo Shell で該当のデータベースを選択した後、以下を実行してください。
なお、既存の履歴データの番号が再利用されないように、履歴データの番号も最大値の計算に含めます。
```js
const maxNumbers = {};

function collectMaxNumbers(collectionName, kind) {
  db.getCollection(collectionName).aggregate([
    {$group: {_id: "$dictionary", maxNumber: {$max: "$number"}}}
  ]).forEach(function (result) {
    const id = String(result._id);
    if (maxNumbers[id] === undefined) {
      maxNumbers[id] = {word: 0, example: 0, article: 0};
    }
    if (result.maxNumber > maxNumbers[id][kind]) {
      maxNumbers[id][kind] = result.maxNumber;
    }
  });
}

collectMaxNumbers("words", "word");
collectMaxNumbers("oldWords", "word");
collectMaxNumbers("examples", "example");
collectMaxNumbers("oldExamples", "example");
collectMaxNumbers("articles", "article");
collectMaxNumbers("oldArticles", "article");

["dictionaries", "oldDictionaries"].forEach(function (collectionName) {
  db.getCollection(collectionName).find({}, {_id: 1}).forEach(function (dictionary) {
    const value = maxNumbers[String(dictionary._id)] || {word: 0, example: 0, article: 0};
    db.getCollection(collectionName).updateOne({_id: dictionary._id}, {$set: {maxNumbers: value}});
  });
});
```

#### TTL インデックス導入に伴う処理
編集履歴データ (`oldWords`, `oldExamples`, `oldArticles`) の削除を、日次ジョブから TTL インデックスに変更しました。
既存の `deletedDate` のインデックスには有効期限が設定されていないため、そのままでは同名のインデックスを作り直せず、有効期限が反映されません。
Mongo Shell で該当のデータベースを選択した後、以下を実行してください。
保持期間は従来のジョブと同じ 90 日です。
```js
db.runCommand({collMod: "oldWords", index: {name: "deletedDate_1", expireAfterSeconds: 7776000}});
db.runCommand({collMod: "oldExamples", index: {name: "deletedDate_1", expireAfterSeconds: 7776000}});
db.runCommand({collMod: "oldArticles", index: {name: "deletedDate_1", expireAfterSeconds: 7776000}});
```
インデックス名が上記と異なる場合は、`db.oldWords.getIndexes()` などで確認して読み替えてください。

併せて、統計データ (`histories`) にも保持期間 120 日の TTL インデックスを追加しました。
こちらは新規のインデックスなので手動の操作は必要ありませんが、アップデート直後に大半のドキュメントが削除対象になるため、負荷の低い時間帯にデプロイすることを推奨します。
なお、WiredTiger (MongoDB のストレージエンジン) は削除によって空いた領域を OS に返さないので、ディスク使用量を実際に減らすには別途 `compact` が必要です。
TTL による削除は 60 秒間隔のバッチで進むため、削除が落ち着いたことを確認してから、Mongo Shell で該当のデータベースを選択した後、以下を実行してください。
```js
function printHistoriesStorage(label) {
  const stats = db.histories.aggregate([{$collStats: {storageStats: {}}}]).toArray()[0].storageStats;
  print(label + ": 実容量 " + Math.round(stats.storageSize / 1048576) + " MiB / 空き " + Math.round((stats.freeStorageSize || 0) / 1048576) + " MiB");
}

printHistoriesStorage("実行前");
db.runCommand({compact: "histories"});
printHistoriesStorage("実行後");
```
`compact` はレプリケーションされないため、レプリカセットを構成している場合はメンバーごとに実行してください。
また、ホスティング環境によっては権限がなく実行できないことがあります。
