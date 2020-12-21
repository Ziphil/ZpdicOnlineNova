## Zatlin とは
Zatlin とは、人工言語の単語の綴りを自動生成するためのシステムです。
特定の書式に従って生成したい綴りのパターンを記述し、それを Zatlin に処理させることで、そのパターンに従って綴りをランダムで生成することができます。
Zatlin を使うことで、単語の綴りを完全に Zatlin に任せて文法や語法の設定に集中することもできますし、単語の綴りが思いつかないときに Zatlin にいくつか候補を出してもらうという使い方もできます。

ZpDIC Online には Zatlin 1.2 が組み込まれており、辞書の設定画面から Zatlin ソースコードを設定することで、単語編集画面で Zatlin を実行して綴りを生成することができます。

Zatlin ソースコードの書き方については、[こちら](introduction)をご覧ください。

## 試してみる
以下は Zatlin ソースコードの例です。
右下の「試す」ボタンを押すと Zatlin の実行画面が開き、ソースコードを編集したり実行したりすることができます。
```zatlin-try
short_vowel = "a" 5 | "e" 3 | "i" 2 | "o" 3 | "u" 2
long_vowel = short_vowel &1
vowel = short_vowel 3 | long_vowel
svowel = vowel 3 | ("y" | "w") vowel - "yi" | "w" ("u" | "o")

sz = "s" | "z"
td = "t" | "d"
kg = "k" | "g"
fv = "f" | "v"
cons = sz 3 | td 3 | kg 3 | fv 3 | ("n" | "h") 2

V = svowel
CV = cons svowel
CVC = cons svowel cons
CVCC = cons svowel cons cons
CCVC = cons cons svowel cons
syll = V | CV 5 | CVC 3 | CVCC 3 | CCVC 2

hard_h = "h" cons | "h" ^
hard_cons = sz sz | td td | kg kg | fv fv | ("n" | "h") &1
hard = hard_h | hard_cons

word = syll | syll syll 5 | syll syll syll 3 - hard
% word
```