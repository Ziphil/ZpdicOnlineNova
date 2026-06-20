# 基本コーディング規約


## 識別子の命名規則
### 表記
- **ファイル名**, **フォルダ名** — kebab-case
  - 例: `icon`, `simple-link.ts`
- **クラス名**, **型名** — UpperCamelCase
  - 例: `Word`, `FestivalProgress`
- **型引数名** — 大文字 1 文字
  - 例: `T`, `K`
- **変数名**, **関数名** — lowerCamelCase
  - 例: `word`, `getEquivalent`
- **定数名** — CONSTANT_CASE
  - 例: `API_URL`
- **コンポーネント名** — UpperCamelCase
  - 例: `Tab`, `WordCard`
- **カスタムデータ属性名** — kebab-case
  - 例: `data-schema`

camelCase においては、頭文字語でも 1 文字目のみ大文字にします。

- 悪い: `userID` → 良い: `userId`
- 悪い: `someXML` → 良い: `someXml`

### 綴り
原則として全て英語を用いてください。
日本語のローマ字表記等は推奨しません。

- 悪い: `tango` → 良い: `word`

略語を使用したり綴りを省略したりはせず、綴りを完全に記してください。

- 悪い: `btn` → 良い: `button`
- 悪い: `id2word` → 良い: `idToWord`
- 悪い: (`GameState` 型の変数に対して) `gs` → 良い: `gameState`, `state`

### 関数やメソッドの名前
関数やメソッドの名前は、原則として動詞から始めて〈動詞＋目的語など〉の形にしてください。

- 悪い: `equivalentCountCalc` → 良い: `calcEquivalentCount`

真偽値を返す関数やメソッドについては、〈`is` ＋形容詞〉の形か〈動詞＋目的語など〉の形にしてください。

- 悪い: `active` → 良い: `isActive`, `getActive`

### 配列の名前
配列やコンテナを表す変数には、複数形を用いてください。
英語として複数形をあまり使わない単語についても、複数形にします (information など)。

- 例: `words` (← `word`)
- 例: `informations` (← `information`)

### エクスポートでの名前
外部から参照されるもの (`export` している変数など) の名前は、その名前で指し得るものがプロジェクト内で一意になる程度に説明的にしてください。
名前を短くしようとする必要はありません。

## TypeScript 共通のコードスタイル
### スペーシング
インデントはスペース 2 つを使用してください。
タブ文字は使用しません。

インポート文の列挙の下には 2 行空けてください。

### 等価性判定
値の等価性を調べるときは、常に `===` と `!==` を用いてください。

### 列挙型
列挙型が必要なときは、まず値の配列を定数として定義します。
その定数の型を `LiteralType` 型関数に渡すことで、それらの文字列のユニオン型を得ることができるので、これを列挙型として利用します。
また、`LiteralUtilType.create` 関数を用いることで、この型に関するユーティリティ関数群 (キャストなど) を得ることができるので、適宜作成しておきます。

以下のようなコードになります。

```typescript
export const SOME_ENUMS = ["edit", "transfer"] as const;
export type SomeEnum = LiteralType<typeof SOME_ENUMS>;
export const SomeEnumUtil = LiteralUtilType.create(SOME_ENUMS);
```

TypeScript の **`enum` は使用しないでください**。

### 早期リターン
早期リターンは**原則として使わないでください**。
関数定義の最後 (もしくは条件分岐がある場合は各分岐の最後) を見れば何が返されるかすぐ分かるようにし、例外的な返り値を見逃さないようにするためです。
返り値の条件分岐を行う際は、メインの条件を if 節に入れ、例外的な条件を else 節に入れてください。

悪い例:
```typescript
if (someExceptionalCondition) {
  return someDefaultValue;
}
…
return someValue;
```

良い例:
```typescript
if (someCondition) {
  …
  return someValue;
} else {
  return someDefaultValue;
}
```

### その他
それ以外の細かなコードスタイルは、設定されている ESLint に従ってください。
