//

import {DictionaryFont} from "/server/internal/skeleton/dictionary/dictionary-font";
import {TemplateWord} from "/server/internal/skeleton/word/template-word";


export interface DictionarySettings {

  akrantiainSource?: string;
  zatlinSource?: string;
  font?: DictionaryFont;
  templateWords: Array<TemplateWord>;
  punctuations: Array<string>;
  ignoredEquivalentPattern?: string;
  pronunciationTitle: string;
  phraseTitle: string;
  exampleTitle: string;
  enableMarkdown: boolean;
  enableDuplicateName: boolean;
  showEquivalentNumber: boolean;

}