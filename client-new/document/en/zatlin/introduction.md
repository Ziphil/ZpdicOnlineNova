<!-- title: Zatlin introduction -->


## Overview
This document briefly describes a practical usage of Zatlin while creating a source code to generate spellings of a hypothetical constructed language.
For the complete specification of Zatlin's syntax, please see [here](/document/zatlin/syntax).

## Simple example
### First pattern
In Zatlin, a description of the form of the spellings to be generated is called a “pattern”.
You can form a pattern that generates complex spellings by combining small patterns one after another.
In this section, we will let Zatlin generate syllables of a simple hypothetical constructed language.

By separating with `|` a string enclosed with `"`, you can describe a pattern that produces one of those strings.
For example, `"a" | "e"` is a pattern that produces either “a” or “e”.
Furthermore, by writing `=` after some variable name and continuing a pattern, you can assign the pattern to the variable and use it later in another pattern.
The basic idea in Zatlin is to create such variable definitions in a row to build the pattern that generates spellings you want in the end.
Here, we will assign the pattern `"a" | "e"` to the variable `vowel`.
```zatlin
vowel = "a" | "e"
```

Now we have defined a pattern that produces a single vowel.
In the same way, we will define a pattern to produce a single consonant.
Assume that there are only three consonants: “s”, “t” and “k”.
```zatlin
cons = "s" | "t" | "k"
```

Finally, we will combine them to define a pattern that produces a consonant followed by a vowel (that is a CV syllable).
If we put multiple patterns in a row separating them by spaces, we can define a new pattern that produces a string consisting of each pattern concatenated in that order.
In this case, we want a consonant followed by a vowel, so we can define the desired pattern by writing `cons vowel`.
Assign it to the variable `syll`.
```zatlin
syll = cons vowel
```

Since we have just defined variables, Zatlin does not yet know which variable pattern to execute.
To let Zatlin know which pattern you want it to execute, write `%` followed by the pattern.
In this case, the pattern we want to execute is `syll`, which produces a single syllable, so write the following:
```zatlin
% syll
```

To summarise, we now have the following Zatlin code:
```zatlin-try
vowel = "a" | "e"
cons = "s" | "t" | "k"
syll = cons vowel
% syll
```
Try running this in Zatlin (you can run it in your browser by clicking “Try” on the right side of the code block).
If it produces a syllable such as “se” or “ka” each time you run it, it is successful.

### Weighting patterns
In most languages, a syllable is not necessarily a sequence of one consonant and one vowel; it may consist of only one vowel, end in a consonant or have two consecutive consonants.
Now remember that you can write a pattern that produces any of multiple patterns by separating them with `|`.
By using this syntax, you can write a pattern that produces any of these various forms of syllables.
Change the definition of `syll` so that it produces one of the following syllables: V, CV, CVC or CVCC.
```zatlin
syll = vowel | cons vowel | cons vowel cons | cons vowel cons cons
```

Note that, when you use `cons` twice like `cons vowel cons`, the two `cons` do not always produces the same string.
Zatlin will first generate a string according to the definition of `cons` at the first `cons`, and then regenerate a string at the second `cons`.
This means that sometimes the two `cons` will produce the same string, resulting “sas” overall, but it will also generate strings such as “tek” and “sat”.

It would be rare for all possible syllable patterns to appear with equal probability.
In Zatlin, you can bias the probability that each pattern is chosen by weighting the patterns separated by `|`.
For example, if you want to make `cons vowel` twice as likely to be chosen as any other pattern, put `2` after the pattern, as in `cons vowel 2`.
You can also use decimals such as `1.5`.
```zatlin
syll = vowel | cons vowel 2 | cons vowel cons 1.5 | cons vowel cons cons
```

Let us weight the consonants similarly.
```zatlin
cons = "s" 5 | "t" 3 | "k" 2
```
In the code above, the sum of the weights is 10, so the probabilities that “s”, “t” and “k” are chosen are 5/10, 3/10 and 2/10, respectively.

After rewriting, the Zatlin code now looks like this:
```zatlin-try
vowel = "a" | "e"
cons = "s" 5 | "t" 3 | "k" 2
syll = vowel | cons vowel 2 | cons vowel cons 1.5 | cons vowel cons cons
% syll
```
If you actually run the code several times, you will see that the output is biased according to the weights you set.

### Exclusion patterns
For the next explanation, we will assign each pattern in `syll` to a variable to make the whole code a little more concise.
```zatlin
V = vowel
CV = cons vowel
CVC = cons vowel cons
CVCC = cons vowel cons cons
syll = V | CV 2 | CVC 1.5 | CVCC
```

In some languages, certain sequences of phonemes are forbidden.
For example, the consonant sequence “tk” is difficult to pronounce so it should not appear in words.
In order to achieve this, Zatlin has a function to exclude strings that match a particular pattern from the pattern output.

If you write a pattern followed by `-` and then another pattern, you can exclude strings that contain strings that could be generated by the pattern written after `-`.
Patterns written after `-` are called “exclusion patterns”.
For example, let us rewrite the `CVCC` above as follows:
```zatlin
CVCC = cons vowel cons cons - "tk" | "kk"
```
Here, `"tk" | "kk"` specified as an exclusion pattern is a pattern that produces either “tk” or “kk”.
As a consequce, `CVCC` will not produce spellings containing “tk” or “kk”.

Let us also allow CCVCC as a syllable pattern.
```zatlin
CCVCC = cons cons vowel cons cons
syll = V | CV 2 | CVC 1.5 | CVCC | CCVCC
```
Now suppose that we want to exclude spellings starting with “st” in addition to spellings containing “tk” and “kk” in CCVCC syllables.
It is currently impossible to exclude only those starting with “st”, because a pattern with an exclusion pattern are supposed to exclude everything as long as they contain strings that the exclusion pattern could produce.
There is, however, a syntax for doing this; just put `^` at the beginning of a pattern.
```zatlin
CCVCC = cons cons vowel cons cons - "tk" | "kk" | ^ "st"
```

In the same way, if you put `^` at the end of a pattern, you can exclude anything that ends with a string that the pattern could produce.
You can also put `^` at both the beginning and the end of a pattern, in which case only the ones that exactly match the string that the pattern could produce will be excluded.

In the end, the entire code looks like this:
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
Try running it several times, and make sure that it does not generate spellings containing “tk” or “kk” or starting with “st”.

### Desribing double letters by backward reference
Now let us think about producing long vowels.
In this language, a long vowel is represented by simply putting the same vowel together, such as “aa”.

If you simply write `vowel vowel` to generate such a long vowel, you will fail.
This is because, as mentioned above, Zatlin will regenerate a string for each occurrence of a variable, even if their names are the same.
Thus the two `vowels` will not necessarily produce the same string.
If you want to generate a string that is exactly the same as the output of the previous pattern, you need to use the backreference.

Within a space-separated pattern, you can backreference a pattern by writing `&` followed by a number, such as `&1` or `&2`.
For example, `&1` will always produce the same string as the one produced by the first pattern.
Therefore, if you write `vowel &1`, `vowel` will first produce a letter, and then `&1` will generate again the same letter that `vowel` has just generated, resulting in a sequence of two identical letters.
Let us give it the name `long`.
```zatlin
long = vowel &1
```

Using this, we will rewrite the vowel parts of the three syllables V, CV and CVC to allow long vowels.
The pattern producing either short or long vowels can be written as `vowel | long`, so we go as the following:
```zatlin
V = vowel | long
CV = cons (vowel | long)
CVC = cons (vowel | long) cons
```
Note that if you want to use a `|`-pattern within a space-separated pattern, you need to enclose it in parentheses.
For example, if you remove the parentheses from the definition of `CV` to make it be `cons vowel | long`, the resulting pattern will end up meaning a choice of `cons vowel` or `long`.

Now, the code looks like this:
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

We have now covered all the features of Zatlin.
In the next section, we will try to build more complex patterns.
You will see how powerful Zatlin is.

## More complex example
First, let us define the phonemes we will use.
We use the common five vowels and weight them accordingly.
```zatlin
short_vowel = "a" 5 | "e" 3 | "i" 2 | "o" 3 | "u" 2
```
Also create a pattern for long vowels and define a pattern to produce either short or long vowels.
We have already seen how to create the long vowel pattern in the previous section.
```zatlin
long_vowel = short_vowel &1
vowel = short_vowel 3 | long_vowel
```

We allow the vowels in syllables to be preceded by a semivowel such as “y” or “w”, not only to be single short or long vowels.
We exclude “yi”, “wu”, and “wo” from this pattern, as they are difficult to distinguish from those without semivowels.
The exclusion pattern to achieve this can be written as `"yi" | "wu" | "wo"`, but it can also be written as `"yi" | "w" ("u" | "o")` using grouping by parentheses.
```zatlin
svowel = vowel 3 | ("y" | "w") vowel - "yi" | "w" ("u" | "o")
```

Next, let us define patterns for consonants.
We separate the variables by articulation position for later use.
```zatlin
sz = "s" | "z"
td = "t" | "d"
kg = "k" | "g"
fv = "f" | "v"
```
In addition to these, we will also allow “n” and “h” as consonants.
You can group arbitrary patterns by enclosing them in parentheses, so you can write something like `("n" | "h") 2`.
```zatlin
cons = sz 3 | td 3 | kg 3 | fv 3 | ("n" | "h") 2
```

Now that we have defined the vowels and consonants that make up a syllable, let us define syllable patterns.
This time, we allow five types of syllables: V, CV, CVC, CVCC and CCVC.
```zatlin
V = svowel
CV = cons svowel
CVC = cons svowel cons
CVCC = cons svowel cons cons
CCVC = cons cons svowel cons
syll = V | CV 5 | CVC 3 | CVCC 3 | CCVC 2
```

We also define patterns to exclude some difficult-to-pronounce spellings from the final result.
Suppose that we want to exclude consonants after “h”, such as “hz”, because they are difficult to pronounce.
We also want to exclude syllables with “h” at the end as well.
A pattern that matches this can be written as follows:
```zatlin
hard_h = "h" cons | "h" ^
```
In addition, consecutive consonants in the same articulation position (including consecutive same consonants) are also difficult to pronounce, so we define a pattern for them to use later.
To represent “nn” or “hh”, you can simply write `"nn" | "hh"`, but you can also write `("n" | "h") &1` using backreference.
```zatlin
hard_cons = sz sz | td td | kg kg | fv fv | ("n" | "h") &1
```
Put these two together for later use as an exclusion pattern.
```zatlin
hard = hard_h | hard_cons
```

Use this exclusion pattern to create a pattern that represents words of one to three syllables, and set this as the main pattern to be executed by Zatlin.
```zatlin
word = syll | syll syll 5 | syll syll syll 3 - hard
% word
```

To summarise, the code we have looks like:
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
If you input this code into Zatlin and execute it, word-like spellings will be generated one after another.
The following are 40 examples generated by Zatlin:
```
gyovsu, ezwiig, takzgyoozn, sef, fagnuuvd, saanvi, tagyeegva, nuukood
ido, gogag, fwakdho, saaoo, zaa, nwakiifek, hevznyud, nukwanookn
gago, zesgnuz, vuu, eesov, geenotzotf, dasu, seetg, twafzos
kod, naatfzo, hya, zata, dfyafti, vadzoog, vsyetnu, sakzfyeskegn
savyozwi, fiit, gugitaaf, kafgaz, hwesvtiifok, gizovz, sezfav, hyaava
```