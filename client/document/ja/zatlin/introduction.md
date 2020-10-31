## 概要
このドキュメントでは、仮想の人工言語の綴りを生成するためのソースコードを構築しながら、Zatlin の実践的な使い方について簡単に解説します。
Zatlin の構文の完全な仕様については、[こちら](syntax)をご覧ください。

## 簡単な例
### 最初のパターン
Zatlin では、生成したい綴りの形式を記述したものを「パターン」と呼び、小さなパターンを組み合わせていくことで複雑な綴りを生成するパターンを構成していきます。
このセクションでは、仮想の単純な人工言語の音節を Zatlin に生成させてみます。

`"` で囲まれた文字列を `|` で区切ることによって、その文字列のうちのどれかを生成するパターンを記述することができます。
例えば、`"a" | "e"` とすれば、「a」もしくは「e」のいずれかが生成されるパターンになります。
さらに、何らかの変数名の後に `=` を書いてパターンを続けることで、変数にそのパターンを代入して、後で別のパターンの中で使うことができます。
Zatlin では、このような変数の定義をたくさん並べて組み合わせていくことで、最終的に生成したいパターンを構築するのが基本です。
ここでは、`"a" | "e"` というパターンを `vowel` という変数に代入してみましょう。
```zatlin
vowel = "a" | "e"
```

これで母音 1 つを生成するパターンが定義できました。
同じようにして子音 1 つを生成するパターンも定義してみましょう。
ここでは、子音は「s」と「t」と「k」の 3 種類のみであるとします。
```zatlin
cons = "s" | "t" | "k"
```

最後にこれらを組み合わせて、子音の後に母音を続けた音節 (つまり CV 音節) を生成するパターンを定義してみましょう。
パターンを複数個スペースで区切って並べると、それぞれのパターンをその順序で連結した文字列を生成する新しいパターンを定義できます。
今回の場合、子音の後に母音を続けたいので、`cons vowel` とすれば欲しいパターンが定義できます。
これを `syll` という変数に代入しておきましょう。
```zatlin
syll = cons vowel
```

ここまでではただ変数を定義しただけなので、Zatlin はまだどの変数のパターンを実際に実行すれば良いか分かりません。
Zatlin に実行してほしいパターンを知らせるには、`%` に続いてパターンを記述します。
今回の場合、実行したいパターンは 1 音節を生成する `syll` なので、次のように記述します。
```zatlin
% syll
```

以上をまとめると、ここまでで次のような Zatlin コードができました。
```zatlin-try
vowel = "a" | "e"
cons = "s" | "t" | "k"
syll = cons vowel
% syll
```
これを実際に Zatlin に実行させてみてください (上のコードの右端にある「試す」からブラウザ上で実行できます)。
実行するたびに「se」や「ka」などの音節が生成されれば成功です。

### パターンの重み付け
言語によっては、音節は必ずしも子音と母音 1 つずつの連続とは限りません。
母音だけから成る音節があったり、子音で終わる音節があったり、子音が 2 連続する音節があったりすることがあります。
パターンを `|` で区切ることでそのうちのどれかを生成するパターンが書けることを思い出すと、このようないろいろな形式の音節のどれかを生成するパターンが書けます。
ここでは、`syll` の定義を変えて、V, CV, CVC, CVCC のいずれかの音節を生成するようにしてみましょう。
```zatlin
syll = vowel | cons vowel | cons vowel cons | cons vowel cons cons
```

ここで注意すべき点として、`cons vowel cons` のように同じ名前の変数を使ったとしても、2 つの `cons` が常に同じ文字列になるとは限りません。
Zatlin はまず最初の `cons` のところで `cons` の定義に従って文字列を生成し、その後 2 回目の `cons` のところで再び文字列を生成し直します。
そのため、「sas」のように 2 つの `cons` に相当する箇所が同じ文字列になることもありますが、「tek」や「sat」のような文字列も生成されます。

さて、全ての音節構造が万遍なく等確率で現れることも珍しいでしょう。
Zatlin では、上のような `|` で区切られた各パターンに重み付けして、各パターンが選ばれる確率を偏らせることができます。
例えば、`cons vowel` が選ばれる確率を他のパターンの 2 倍にしたければ、`cons vowel 2` のように `2` をパターンの後に置くことでこれを実現できます。
`1.5` などの小数も利用できます。
```zatlin
syll = vowel | cons vowel 2 | cons vowel cons 1.5 | cons vowel cons cons
```

同様に、子音にも重み付けしてみましょう。
```zatlin
cons = "s" 5 | "t" 3 | "k" 2
```
このようにすると、重みの合計は 10 なので、「s」と「t」と「k」が選ばれる確率はそれぞれ 5/10, 3/10, 2/10 となります。

以上のように書き換えると、Zatlin コードは次のようになりました。
```zatlin-try
vowel = "a" | "e"
cons = "s" 5 | "t" 3 | "k" 2
syll = vowel | cons vowel 2 | cons vowel cons 1.5 | cons vowel cons cons
% syll
```
実際に何度か実行して試してみると、設定した重みに従って出力が偏るのが分かると思います。

### 除外設定
次の説明のために、`syll` を構成する各パターンを変数に代入して、少し簡潔にしておきます。
```zatlin
V = vowel
CV = cons vowel
CVC = cons vowel cons
CVCC = cons vowel cons cons
syll = V | CV 2 | CVC 1.5 | CVCC
```

言語によっては、特定の音素の並びが禁則になっていることもあります。
例えば、「tk」という子音の並びは発音しづらいので単語中では現れないなどの具合です。
これを実現するために、パターンの出力から特定のパターンに合致する文字列を除外する機能があります。

パターンの後に `-` に続けて別のパターンを記述すると、`-` の後に書かれたパターンが生成し得る文字列を含むような文字列を出力から除外できます。
`-` の後に書かれたパターンは「除外パターン」と呼ばれます。
例えば、上の `CVCC` を次のように書き換えてみましょう。
```zatlin
CVCC = cons vowel cons cons - "tk" | "kk"
```
除外パターンとして指定された `"tk" | "kk"` は、「tk」もしくは「kk」のいずれかを生成するパターンです。
したがって、上のようにすると、`CVCC` は「tk」か「kk」を含む綴りを生成しなくなります。

さて、音節のパターンとして CCVCC も許すようにしましょう。
```zatlin
CCVCC = cons cons vowel cons cons
syll = V | CV 2 | CVC 1.5 | CVCC | CCVCC
```
ここで、CCVCC 音節では、「tk」や「kk」を含む綴りの他に、「st」から始まる綴りを除外したいとしましょう。
しかし、除外パターンを使ったパターンでは、除外パターンが生成し得る文字列を含んでさえいれば全て除外されることになっているので、「st」から始まるもののみを除外するというのは今のところできません。
しかし、これを実現する構文もきちんと用意されていて、パターンの最初に `^` という記号を置くことで実現できます。
```zatlin
CCVCC = cons cons vowel cons cons - "tk" | "kk" | ^ "st"
```

同様にして、パターンの最後に `^` を置けば、そのパターンが生成し得る文字列で終わるものを除外できるようになります。
パターンの最初と最後の両方に `^` を置くこともでき、その場合は、そのパターンが生成し得る文字列とちょうど一致するもののみが除外されます。

結局、コード全体は次のようになりました。
```zatlin-try
vowel = "a" | "e"
cons = "s" 5 | "t" 3 | "k" 2
V = vowel
CV = cons vowel
CVC = cons vowel cons
CVCC = cons vowel cons cons - "tk" | "kk"
CCVCC = cons cons vowel cons cons - "tk" | "kk" | ^ "st"
syll = V | CV 2 | CVC 1.5 | CVCC | CCVCC
% syll
```
何度か実行してみて、「tk」や「kk」を含む綴りや「st」で始まる綴りが生成されないことを確認してください。

### 後方参照で文字の連続
今度は、長母音を生成することを考えてみましょう。
この言語では、「aa」のように同じ母音を単に並べることで長母音を表すことにします。

このような長母音を生成しようとして単に `vowel vowel` とすると失敗します。
すでに述べたように、同名の変数名が並んでいても、Zatlin は変数が現れるごとに文字列を生成し直すため、2 つある `vowel` が同じ文字列を生成するとは限らないからです。
前に出てきたパターンの出力と全く同じ文字列を出力したい場合は、後方参照機能を使う必要があります。

スペースで区切られたパターンの中で、`&1` や `&2` などのように `&` の後に数字を続けた記号を書くと、後方参照することができます。
例えば、`&1` は 1 番目に出てきたパターンが出力した文字列と同一の文字列を常に出力します。
したがって、`vowel &1` と書けば、まず最初の `vowel` に沿って文字列が生成され、その後の `&1` によって `vowel` が今生成した文字列が再び生成されるので、結果的に同じ文字列 2 つが連続した文字列が生成されます。
これには `long` という名前をつけておきましょう。
```zatlin
long = vowel &1
```

これを使って、V, CV, CVC の 3 種類の音節の母音部分に長母音を許すように書き換えてみましょう。
短母音もしくは長母音のいずれかを生成するパターンは `vowel | long` と書けるので、次のようにします。
```zatlin
V = vowel | long
CV = cons (vowel | long)
CVC = cons (vowel | long) cons
```
ここで注意すべき点として、スペースで区切られたパターン内で `|` による選択パターンを使いたい場合は、前後を括弧で囲む必要があります。
例えば、`CV` の定義において括弧を外して `cons vowel | long` としてしまうと、`cons vowel` と `long` の 2 択になってしまいます。

以上で、コードは次のようになりました。
```zatlin-try
vowel = "a" | "e"
long = vowel &1
cons = "s" 5 | "t" 3 | "k" 2
V = vowel | long
CV = cons (vowel | long)
CVC = cons (vowel | long) cons
CVCC = cons vowel cons cons - "tk" | "kk"
CCVCC = cons cons vowel cons cons - "tk" | "kk" | ^ "st"
syll = V | CV 2 | CVC 1.5 | CVCC | CCVCC
% syll
```

これで Zatlin の機能は一通り説明し終わりました。
次のセクションでは、より複雑なパターンを構築してみます。 
Zatlin の記述力の高さが実感できると思います。

## より複雑な例
まずは使う音素を定義しましょう。
母音は通常の 5 種類として、重み付けもしてみます。
```zatlin
short_vowel = "a" 5 | "e" 3 | "i" 2 | "o" 3 | "u" 2
```
長母音のパターンも作って、短母音と長母音のどちらかを生成するパターンも定義しておきます。
長母音のパターンの作り方は前のセクションでやりましたね。
```zatlin
long_vowel = short_vowel &1
vowel = short_vowel 3 | long_vowel
```

音節中に現れる母音部分としては、単母音もしくは長母音単独だけでなく、その前に「y」や「w」などの半母音が付いたものも許すことにしましょう。
ただし、「yi」と「wu」と「wo」については、半母音がない場合と区別がしづらいと考え、このパターンから除外することにします。
これを実現する除外パターンは単に `"yi" | "wu" | "wo"` と書いても良いですが、括弧によるグループ化を使って `"yi" | "w" ("u" | "o")` と書くこともできます。
```zatlin
svowel = vowel 3 | ("y" | "w") vowel - "yi" | "w" ("u" | "o")
```

次に子音ですが、まず次の 8 種類を考えることにします。
後々のことを考えて、調音位置ごとに変数を分けておきます。
```zatlin
sz = "s" | "z"
td = "t" | "d"
kg = "k" | "g"
fv = "f" | "v"
```
これに加えて「n」と「h」も子音として許すことにします。
任意のパターンは括弧で囲んでグループ化できるので、`("n" | "h") 2` のような記述もできます。
```zatlin
cons = sz 3 | td 3 | kg 3 | fv 3 | ("n" | "h") 2
```

これで音節の構成要素となる母音と子音の定義が終わったので、次に音節の定義をしましょう。
今回は、V, CV, CVC, CVCC, CCVC の 5 パターンを音節として許すことにします。
```zatlin
V = svowel
CV = cons svowel
CVC = cons svowel cons
CVCC = cons svowel cons cons
CCVC = cons cons svowel cons
syll = V | CV 5 | CVC 3 | CVCC 3 | CCVC 2
```

さて、このままでは発音しづらい綴りが生成されることがあるので、そのようなものを最終的な生成結果から除外するために、除外設定用のパターンを定義していきましょう。
まず、「hz」のように「h」の後に子音が続いたものは発音しづらいので除外し、さらに音節末に「h」がある場合も同様に除外したいとします。
これに合致するパターンは次のように書けます。
```zatlin
hard_h = "h" cons | "h" ^
```
さらに、調音位置が同じ子音が連続したもの (同じ文字が連続したものも含む) も発音しづらいので、これも後で除外するために変数に定義しておきます。
「nn」もしくは「hh」を表すには、素朴に `"nn" | "hh"` としても良いですが、後方参照を用いて `("n" | "h") &1` ともできます。
```zatlin
hard_cons = sz sz | td td | kg kg | fv fv | ("n" | "h") &1
```
後で除外パターンとして使うため、この 2 つをまとめておきましょう。
```zatlin
hard = hard_h | hard_cons
```

この除外パターンを使って、1 音節から 3 音節までの単語を表すパターンを作り、これを Zatlin に実行させるメインパターンに設定します。
```zatlin
word = syll | syll syll 5 | syll syll syll 3 - hard
% word
```

以上をまとめると、コードは次のようになりました。
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
これを Zatlin に読み込ませて実行すれば、単語っぽい綴りが次々と生成されるはずです。
以下は、実際に Zatlin を実行して得られた 40 個の生成例です。
```
gyovsu, ezwiig, takzgyoozn, sef, fagnuuvd, saanvi, tagyeegva, nuukood
ido, gogag, fwakdho, saaoo, zaa, nwakiifek, hevznyud, nukwanookn
gago, zesgnuz, vuu, eesov, geenotzotf, dasu, seetg, twafzos
kod, naatfzo, hya, zata, dfyafti, vadzoog, vsyetnu, sakzfyeskegn
savyozwi, fiit, gugitaaf, kafgaz, hwesvtiifok, gizovz, sezfav, hyaava
```