<!-- title: About Zatlin -->


## About Zatlin
Zatlin is a system for automatically generating spellings of words in constructed languages.
By writing spelling patterns that you want to generate according to a specific format and letting Zatlin process them, you can randomly generate spellings according to the pattern.
With Zatlin, you can leave the creation of spellings completely to Zatlin and concentrate on setting up the grammar, or you can ask Zatlin to suggest some spellings for a word when you cannot think of an appropriate spelling.

ZpDIC Online includes Zatlin 1.2 in itself.
By configuring a Zatlin source code in the dictionary setting page, you can run Zatlin in the word editing window to generate spellings.

For more information about the format of Zatlin code, please see [here](./introduction).

## Try
The following is an example of a Zatlin source code.
Click the “Try” button at the right bottom to open the Zatlin execution window, where you can edit and run a code.
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