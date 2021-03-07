## JSON ファイルの仕様
ダウンロード機能でダウンロードできる JSON ファイル、およびアップロード機能において期待する JSON ファイルの仕様は、以下の通りです。
このファイルの形式は [OneToMany-JSON 形式](https://conlinguistics.wikia.org/ja/wiki/OTM-JSON)の version 2 と互換性があります。
なお、以下の仕様は [CDDL 形式](https://tools.ietf.org/html/rfc8610)で書かれています。
```cddl
json = {
  "words": [* word]  ; 単語データ
  "version": 2
  settings           ; 設定データ
  * text => any
}

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
  "text": text         ; プレーンテキスト形式の内容
                       ;   Markdown が有効になっている場合はマークアップを削除したもの
  ? "markdown": text   ; Markdown 形式の内容
                       ;   Markdown が無効になっている場合はこのキーはありません
}

variation = {
  "title": text  ; 変化形の分類
  "form": text   ; 変化形
}

relation = {
  "title": text  ; 関連語の分類
  "entry": {
    "id": int     ; 関連語の単語 ID
    "form": text  ; 関連語の綴り
  }
}

settings = (
  "zpdic": {
    ? "punctuations": [* text]  ; 訳語などを区切る句読点
    "pronunciationTitle": text  ; 内容欄で発音が記載されている分類名
    * text => any
  }
  "zpdicOnline": {
    ? "explanation": text   ; 辞書ページを開いたときに表示される説明テキスト
    "enableMarkdown": bool  ; Markdown の有効/無効
    * text => any
  }
  ? "snoj": text    ; Akrantiain 用 snoj データ
  ? "zatlin": text  ; Zatlin 用ソースコード
)
```

`* text => any` となっている箇所には、アップロード機能を利用した場合にそこにあったデータがそのまま保持されて出力されます。
ZpDIC Online 上で辞書を作成した場合は、この箇所には何も出力されません。