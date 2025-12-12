//

import {DictionaryFont} from "/server/internal/skeleton/dictionary/dictionary-font";
import {LiteralType, LiteralUtilType} from "/server/util/literal-type";
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


export const MARKDOWN_FEATURES = ["basic", "supsub", "font"] as const;
export type MarkdownFeature = LiteralType<typeof MARKDOWN_FEATURES>;
export const MarkdownFeatureUtil = LiteralUtilType.create(MARKDOWN_FEATURES);