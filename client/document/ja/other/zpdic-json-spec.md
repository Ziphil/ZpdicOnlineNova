---
title: ZpDIC API 形式の仕様
---


## ZpDIC API 形式の仕様
エクスポート機能でダウンロードできる ZpDIC API 形式 (拡張子 `.zpdc`) のファイル、およびインポート機能において期待する同形式のファイルの仕様は、以下の通りです。
この形式は、公開 REST API v1 (`/api/v1`) で単語データや例文データをやり取りする際の表現とほぼ同じ構造をもっています。
なお、以下の仕様は [CDDL 形式](https://tools.ietf.org/html/rfc8610)で書かれています。

```cddl
json = {
    "version":  1            ; バージョン
    "words":    [* word]     ; 単語
    "examples": [* example]  ; 例文
}

; 単語関連

word = {
    "id":            text         ; 単語の内部 ID (エクスポート時のみ出力)
    "number":        int          ; 単語番号
    "spelling":      text         ; 綴り
    "pronunciation": text         ; 発音
    "tags":          [* text]     ; タグ
    "sections":      [* section]  ; 大区分
}

section = {
    "equivalents":  [* equivalent]   ; 訳語
    "informations": [* information]  ; 内容
    "phrases":      [* phrase]       ; 関連語句
    "variations":   [* variation]    ; 変化形
    "relations":    [* relation]     ; 関連語
}

equivalent = {
    "titles":         [* text]  ; 品詞・分類
    "terms":          [* text]  ; 訳語
    "termString":     text      ; 訳語欄に入力された文字列
    "ignoredPattern": text      ; 訳語で無視するパターン
    "hidden":         bool      ; 非表示にするか
}

information = {
    "title":  text  ; 見出し
    "text":   text  ; 内容
    "hidden": bool  ; 非表示にするか
}

phrase = {
    "titles":         [* text]  ; 分類
    "expression":     text      ; 語句
    "terms":          [* text]  ; 訳語
    "termString":     text      ; 訳語欄に入力された文字列
    "ignoredPattern": text      ; 訳語で無視するパターン
    "text":           text      ; 補足説明
    "hidden":         bool      ; 非表示にするか
}

variation = {
    "title":         text  ; 種類
    "spelling":      text  ; 変化形
    "pronunciation": text  ; 発音
}

relation = {
    "titles":   [* text]  ; 分類
    "number":   int       ; 関連語の単語番号
    "spelling": text      ; 関連語の綴り
}

; 例文関連

example = {
    "id":          text             ; 例文の内部 ID (エクスポート時のみ出力)
    "number":      int              ; 例文番号
    "sentence":    text             ; この言語での例文
    "translation": text             ; 自然言語訳
    "supplement":  text             ; 補足説明
    "tags":        [* text]         ; タグ
    "words":       [* linkedWord]   ; 使用単語
    "offer":       linkedExampleOffer / null  ; 関連付け例文
}

linkedWord = {
    "number": int  ; 使用している単語の単語番号
}

linkedExampleOffer = {
    "catalog": text  ; 例文集タイトル
    "number":  int   ; 例文集内での番号 (1 から)
}
```

## インポート時の注意点
`id` フィールドは ZpDIC 内部のデータ識別用 ID であり、エクスポート時にのみ出力されます。
インポート時には無視されるため、インポート用にファイルを用意する場合は省略しても構いません。
単語や例文の同一性の判定や、関連語や使用単語の紐付けには、`id` ではなく `number` を使用します。

単語番号および例文番号は、それぞれ 1 つのファイルの中で一意でなければなりません。
複数の単語や例文が同じ番号をもっているファイルをアップロードした場合、ZpDIC 上での検索や編集が正常に機能する保証はしません。

単語データ内の関連語 (`relation`) や例文データ内の使用単語 (`linkedWord`) は、`number` によって紐付けられます。
関連語や使用単語に指定されている番号をもつ単語が、必ずファイル内に存在する必要があります。
そうでないファイルをアップロードした場合、ZpDIC 上では正常に関連語や使用単語が表示されません。

各フィールドには、`spelling` や `number` など一部の必須フィールドを除き、既定値が設定されています。
インポート用のファイルでは、既定値で構わないフィールドは省略できます。

例文集に紐付けられた例文では、自然言語訳が無視されます。
アップロードしたファイルの内容によらず、例文集の自然言語訳は ZpDIC 上に保存されているもので表示されます。
