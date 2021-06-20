//


export type WordNameFrequencies = {
  whole: WordNameFrequency,
  char: Array<[char: string, frequency: WordNameFrequency]>;
};
export type WordNameFrequency = {all: number, word: number};

export type DictionaryStatistics = {
  wordCount: {raw: number, tokipona: number, coverage: number},
  wordNameLengths: WholeAndRatio<StringLengths>,
  equivalentNameCount: WholeAndRatio<number>,
  informationCount: WholeAndRatio<number>,
  informationTextLengths: WholeAndRatio<StringLengths>,
  exampleCount: WholeAndRatio<number>
};
export type StringLengths = {kept: number, nfd: number, nfc: number};
export type WholeAndRatio<T> = {whole: T, ratio: T};