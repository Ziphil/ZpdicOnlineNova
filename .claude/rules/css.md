# CSS のコーディング規約


## CSS プロパティ
### 論理プロパティ
物理プロパティは使用せず、常に論理プロパティを使用してください。
ただし、`width`, `height` のみ (`inline-size`, `block-size` の代わりに) 許容します。

- 悪い: `margin-left` → 良い: `margin-inline-end`
- 悪い: `height` → 良い: `block-size`
- 悪い: `right` → 良い: `inset-inline-start`

`margin`, `padding`, `inset` などの寸法系の一括指定プロパティは、複数方向全てに同じ寸法を設定したい場合に限って使用しても構いません。

- 悪い: `margin: 1zu 2zu;` → 良い: `margin-block: 1zu; margin-inline: 2zu;`
- 良い: `margin: 1zu;`

### プロパティ指定の順序
プロパティは概ね以下の順序で記載してください。

- 寸法
  - `width`, `height` など
- 余白や位置
  - `margin`, `padding`, `gap`, `inset` など
- 寸法関連の装飾設定
  - `font-size`, `letter-spacing`, `border-radius` など
- 色などの装飾設定
  - `color`, `border`,  `background` など
- レイアウト関連
  - `display`, `position`, フレックスボックスやグリッドレイアウトの設定

### 要素セレクタ
要素セレクタ (`li`, `div` など) は使わないでください。
原則として、スタイルを設定したい要素にはクラス名を付けて、クラスセレクタを用いてスタイリングしてください。

## CSS 値
### 寸法
絶対的な寸法の指定には、専用の `zu` 単位を利用してください。
`px` や `rem` 等は使用しないでください。

```scss
  margin-block-start: 4zu;
```
