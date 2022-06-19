<!-- title: About Akrantiain -->


## About Akrantiain
Akrantiain is a system for automatically generating phonetic symbols from the spelling of words in constructed languages.
By writing spelling rules according to a specific format and letting Akrantiain process them, you can generate phonetic symbols.

ZpDIC Online includes an extension of Akrantiain 0.7.0 in itself.
If you configure an Akrantiain source code (or a snoj data) in the dictionary setting page, the phonetic representations are automatically generated and displayed next to the headwords in the dictionary page.

For more information about the format of Akrantiain code, please see [here](/document/akrantiain/introduction).

## Try
The following is an example of a Akrantiain source code.
Click the “Try” button at the right bottom to open the Akrantiain execution window, where you can edit and run a code.
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