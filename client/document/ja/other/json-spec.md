<!-- title: ダウンロード JSON ファイルの仕様 -->


## JSON ファイルの仕様
ダウンロード機能でダウンロードできる JSON ファイル、およびアップロード機能において期待する JSON ファイルの仕様は、以下の通りです。
このファイルの形式は [OneToMany-JSON 形式](https://wiki.conlinguistics.jp/OTM-JSON)の version 2 と互換性があります。
なお、以下の仕様は [CDDL 形式](https://tools.ietf.org/html/rfc8610)で書かれています。

```cddl
json = {
    "version":  2
    "words":    [* word]     ; 単語
    "examples": [* example]  ; 例文
    settings                 ; 設定
}

; 単語関連

word = {
    "entry": {
        "id":   int                  ; 単語 ID
        "form": text                 ; 綴り
    }
    "tags":         [* tag]          ; タグ
    "translations": [* translation]  ; 訳語
    "contents":     [* content]      ; 内容
    "variations":   [* variation]    ; 変化形
    "relations":    [* relation]     ; 関連語
}

translation = {
    "title":    text      ; 品詞
    "forms":    [* text]  ; 訳語
    "rawForms": text      ; 訳語欄に入力された文字列
}

tag = text

content = {
    "title": text     ; 見出し
    "text":  text     ; 内容
}

variation = {
    "title": text     ; 種類
    "form":  text     ; 変化形
}

relation = {
    "title": text     ; 分類
    "entry": {
        "id":   int   ; 関連語の ID
        "form": text  ; 関連語の綴り
    }
}

; 例文関連

example = {
    "id":          int             ; 例文 ID
    "tags":        [* tag]         ; タグ
    "sentence":    text            ; この言語での例文
    "translation": text            ; 自然言語訳
  ? "supplement":  text            ; 補足説明
    "words":       [* linkedWord]  ; 使用単語
  ? "offer":       exampleOffer    ; 関連付け例文
}

linkedWord = {
    "id": int  ; 使用している単語の ID
}

exampleOffer = {
    "catalog": text  ; 例文集タイトル
    "number":  int   ; 例文集内での番号 (1 から)
}

; 設定関連

settings = (
    "zpdicOnline": {
      ? "explanation":        text      ; 説明
        "punctuations":       [* text]  ; 区切り文字
      ? "ignoredPattern":     text      ; 訳語で無視するパターン
        "pronunciationTitle": text      ; 発音データの見出し
    }
  ? "snoj": text                        ; Akrantiain ソースコード
  ? "zatlin": text                      ; Zatlin ソースコード
)
```

## JSON アップロード時の注意点
単語 ID および例文 ID は、それぞれ 1 つのファイルの中で一意でなければなりません。
複数の単語や例文が同じ ID をもっているファイルをアップロードした場合、ZpDIC 上での検索や編集が正常に機能する保証はしません。

単語データ内の関連語や例文データ内の使用単語は、ID によって紐付けられます。
関連語や使用単語に指定されている ID をもつ単語が、必ずファイル内に存在する必要があります。
そうでないファイルをアップロードした場合、ZpDIC 上では正常に関連語や使用単語が表示されません。

例文集に紐付けられた例文では、自然言語訳が無視されます。
アップロードしたファイルの内容によらず、例文集の自然言語訳は ZpDIC 上に保存されているもので表示されます。