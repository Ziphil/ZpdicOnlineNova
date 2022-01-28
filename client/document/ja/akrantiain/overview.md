<!-- title: Akrantiain とは -->


## Akrantiain とは
Akrantiain とは、人工言語の単語の綴りから発音記号を自動生成するためのシステムです。
特定の書式に従って綴りの発音規則を記述し、それを Akrantiain に処理させることで、発音記号を自動的に生成させることができます。

ZpDIC Online には Akrantiain 0.7.0 を拡張したものが組み込まれており、辞書の設定画面から Akrantiain ソースコード (snoj データ) を設定することで、辞書ページにおいて発音記号が自動生成され、見出し語の横に表示されるようにできます。

Akrantiain ソースコードの書き方については、[こちら](introduction)をご覧ください。

## 試してみる
以下は Akrantiain ソースコードの例です。
右下の「試す」ボタンを押すと Akrantiain の実行画面が開き、ソースコードを編集したり実行したりすることができます。
```akrantiain-try
@FALL_THROUGH
sz = "s" | "z"
td = "t" | "d"
kg = "k" | "g"
fv = "f" | "v"
cons = sz | td | kg | fv | "n" | "h"

"aa" -> /aː/; "ee" -> /eː/; "ii" -> /iː/
"oo" -> /oː/; "uu" -> /uː/
"a" -> /a/; "e" -> /e/; "i" -> /i/
"o" -> /o/; "u" -> /u/

"ty" -> /t͡ʃ/; "dy" -> /d͡ʒ/
"ny" -> /ɲ/; "hy" -> /ç/
"tw" -> /θ/; "dw" -> /ð/
cons "y" -> $ /ʲ/; cons "w" -> $ /ʷ/
"y" -> /j/; "w" -> /w/
"t" sz -> /t͡s/ //; "d" sz -> /d͡z/ //

"s" -> /s/; "z" -> /z/
"t" -> /t/; "d" -> /d/
"k" -> /k/; "g" -> /ɡ/
"f" -> /f/; "v" -> /v/
"n" -> /n/; "h" -> /h/
```