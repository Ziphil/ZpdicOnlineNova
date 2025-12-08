//

import {DictionaryFont} from "/server/internal/skeleton/dictionary/dictionary-font";
import {TemplateWord} from "../template-word/template-word";


export interface DictionarySettings {

  akrantiainSource?: string;
  zatlinSource?: string;
  font: DictionaryFont;
  templateWords: Array<TemplateWord>;
  punctuations: Array<string>;
  ignoredEquivalentPattern: string;
  pronunciationTitle: string;
  phraseTitle: string;
  exampleTitle: string;
  markdownFeatures: Array<MarkdownFeature>;
  enableAdvancedWord: boolean;
  enableProposal: boolean;
  enableDuplicateName: boolean;
  showVariationPronunciation: boolean;
  showEquivalentNumber: boolean;
  showSectionNumber: boolean;

}


export type MarkdownFeature = "basic" | "font";