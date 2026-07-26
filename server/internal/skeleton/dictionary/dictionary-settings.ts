//

import {DictionaryFont} from "/server/internal/skeleton/dictionary/dictionary-font";
import {LiteralType, LiteralUtilType} from "/server/util/literal-type";
import {TemplateWord} from "../template-word/template-word";


export interface DictionarySettings {

  akrantiainSource?: string;
  zatlinSource?: string;
  font: DictionaryFont;
  fontTargets: Array<DictionaryFontTarget>;
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
  showOrdinarySpelling: boolean;
  showEquivalentNumber: DictionaryNumberMode;
  showSectionNumber: DictionaryNumberMode;

}


export const DICTIONARY_NUMBER_MODES = ["show", "onlyNecessary", "hide"] as const;
export type DictionaryNumberMode = LiteralType<typeof DICTIONARY_NUMBER_MODES>;
export const DictionaryNumberModeUtil = LiteralUtilType.create(DICTIONARY_NUMBER_MODES);

export const DICTIONARY_FONT_TARGET = ["heading", "phrase", "variation", "relation", "example", "text"] as const;
export type DictionaryFontTarget = LiteralType<typeof DICTIONARY_FONT_TARGET>;
export const DictionaryFontTargetUtil = LiteralUtilType.create(DICTIONARY_FONT_TARGET);

export const MARKDOWN_FEATURES = ["basic", "supsub", "font"] as const;
export type MarkdownFeature = LiteralType<typeof MARKDOWN_FEATURES>;
export const MarkdownFeatureUtil = LiteralUtilType.create(MARKDOWN_FEATURES);