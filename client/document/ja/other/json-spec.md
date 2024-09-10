<!-- title: ダウンロード JSON ファイルの仕様 -->


## JSON ファイルの仕様
ダウンロード機能でダウンロードできる JSON ファイル、およびアップロード機能において期待する JSON ファイルの仕様は、以下の通りです。
このファイルの形式は [OneToMany-JSON 形式](https://conlinguistics.wikia.org/ja/wiki/OTM-JSON)の version 2 と互換性があります。
なお、以下の仕様は [CDDL 形式](https://tools.ietf.org/html/rfc8610)で書かれています。

```cddl
json = {
  "version": 2
  "words": [* word]        ; 単語
  "examples": [* example]  ; 例文
  settings                 ; 設定
}

; 単語関連

word = {
  "entry": {
    "id": int     ; 単語 ID
    "form": text  ; 単語の綴り
  }
  "translations": [* translation]  ; 訳語
  "tags": [* tag]                  ; タグ
  "contents": [* content]          ; 内容
  "variations": [* variation]      ; 変化形
  "relations": [* relation]        ; 関連語
}

translation = {
  "title": text      ; 訳語の分類
  "forms": [* text]  ; 訳語
}

tag = text

content = {
  "title": text        ; 内容の分類
  "text": text         ; 内容テキスト
}

variation = {
  "title": text  ; 変化形の分類
  "form": text   ; 変化形
}

relation = {
  "title": text   ; 関連語の分類
  "entry": {
    "id": int     ; 関連語の単語 ID
    "form": text  ; 関連語の綴り
  }
}

;  例文関連

example = {
  "id": int
  "sentence": text
  "translation": text
  ? "supplement": text
  "tags": [* tag] 
  "words": [* linked_word]
}

linked_word = {
  "id": int
}

; 設定関連

settings = (
  "zpdicOnline": {
    ? "explanation": text       ; 辞書ページを開いたときに表示される説明テキスト
    "punctuations": [* text]    ; 訳語などを区切る句読点
    "pronunciationTitle": text  ; 内容欄で発音が記載されている分類名
    "enableMarkdown": bool      ; Markdown の有効/無効
  }
  ? "snoj": text    ; Akrantiain 用 snoj データ
  ? "zatlin": text  ; Zatlin 用ソースコード
)
```