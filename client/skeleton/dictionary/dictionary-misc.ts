//


export interface WordNameFrequencies {

  whole: WordNameFrequency;
  char: Array<[char: string, frequency: WordNameFrequency]>;

};


export interface WordNameFrequency {

  all: number;
  word: number;

};


export interface DictionaryStatistics {

  wordCount: {raw: number, tokipona: number, logTokipona: number | null, ctwi: number | null, coverage: number};
  wordNameLengths: WholeAverage<StringLengths>;
  equivalentNameCount: WholeAverage<number>;
  informationCount: WholeAverage<number>;
  informationTextLengths: WholeAverage<StringLengths>;
  exampleCount: WholeAverage<number>;

};


export type StringLengths = {kept: number, nfd: number, nfc: number};
export type WholeAverage<T> = {whole: T, average: T};