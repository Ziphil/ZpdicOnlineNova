//

import {Cursor} from "mongoose";
import {DictionaryStatistics, StringLengths, WholeAverage, WordSpellingFrequencies, WordSpellingFrequency} from "/server/internal/skeleton";
import {Example, Word} from "/server/model";


/** 辞書の統計情報を計算します。
 * `wordCursor` には、`name`, `sections.equivalents`, `sections.informations` を含むフィールドを持つ `Word` のカーソルを指定してください (それ以外のフィールドは使いません)。
 * `exampleCursor` には、任意の `Example` のカーソルを指定できます (中身を使いません)。 */
export async function calcDictionaryStatistics(wordCursor: Cursor<Word, any>, exampleCursor: Cursor<Example, any>): Promise<DictionaryStatistics> {
  let rawWordCount = 0;
  const wholeWordSpellingLengths = {kept: 0, nfd: 0, nfc: 0};
  let wholeEquivalentTermCount = 0;
  let wholeInformationCount = 0;
  const wholeInformationTextLengths = {kept: 0, nfd: 0, nfc: 0};
  let wholeExampleCount = 0;
  for await (const word of wordCursor) {
    rawWordCount ++;
    wholeWordSpellingLengths.kept += [...word.name].length;
    wholeWordSpellingLengths.nfd += [...word.name.normalize("NFD")].length;
    wholeWordSpellingLengths.nfc += [...word.name.normalize("NFC")].length;
    for (const section of word.sections) {
      for (const equivalent of section.equivalents) {
        wholeEquivalentTermCount += equivalent.names.length;
      }
      for (const information of section.informations) {
        wholeInformationCount ++;
        wholeInformationTextLengths.kept += [...information.text].length;
        wholeInformationTextLengths.nfd += [...information.text.normalize("NFD")].length;
        wholeInformationTextLengths.nfc += [...information.text.normalize("NFC")].length;
      }
    }
  }
  for await (const example of exampleCursor) {
    wholeExampleCount ++;
  }
  const statistics = {
    wordCount: calcWordCount(rawWordCount),
    wordNameLengths: calcWholeAvarage(wholeWordSpellingLengths, rawWordCount),
    equivalentNameCount: calcWholeAvarage(wholeEquivalentTermCount, rawWordCount),
    informationCount: calcWholeAvarage(wholeInformationCount, rawWordCount),
    informationTextLengths: calcWholeAvarage(wholeInformationTextLengths, rawWordCount),
    exampleCount: calcWholeAvarage(wholeExampleCount, rawWordCount)
  };
  return statistics;
}

function calcWholeAvarage<V extends number | StringLengths>(value: V, rawWordCount: number): WholeAverage<V> {
  if (typeof value === "number") {
    return {whole: value, average: value / rawWordCount} as any;
  } else {
    return {whole: value, average: {kept: value.kept / rawWordCount, nfd: value.nfd / rawWordCount, nfc: value.nfc / rawWordCount}} as any;
  }
};

function calcWordCount(rawWordCount: number): DictionaryStatistics["wordCount"] {
  const raw = rawWordCount;
  const tokipona = rawWordCount / 120;
  const logTokipona = (rawWordCount <= 0) ? null : Math.log10(rawWordCount / 120);
  const ctwi = (rawWordCount <= 0) ? null : (Math.log(rawWordCount) / Math.log(120)) * 120;
  const coverage = Math.log10(rawWordCount) * 20 + 20;
  return {raw, tokipona, logTokipona, ctwi, coverage};
};

export async function calcWordSpellingFrequencies(query: Cursor<Word, any>): Promise<WordSpellingFrequencies> {
  const wholeFrequency = {all: 0, word: 0};
  const charFrequencies = new Map<string, WordSpellingFrequency>();
  for await (const word of query) {
    const countedChars = new Set<string>();
    for (const char of word.name) {
      const frequency = charFrequencies.get(char) ?? {all: 0, word: 0};
      if (!countedChars.has(char)) {
        frequency.word ++;
        countedChars.add(char);
      }
      frequency.all ++;
      wholeFrequency.all ++;
      charFrequencies.set(char, frequency);
    }
    wholeFrequency.word ++;
  }
  const frequencies = {whole: wholeFrequency, char: Array.from(charFrequencies.entries())};
  return frequencies;
}