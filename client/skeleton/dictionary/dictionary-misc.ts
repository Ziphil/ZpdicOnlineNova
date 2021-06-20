//


export type WordNameFrequencies = {
  whole: WordNameFrequency,
  char: Array<[char: string, frequency: WordNameFrequency]>;
};
export type WordNameFrequency = {all: number, word: number};