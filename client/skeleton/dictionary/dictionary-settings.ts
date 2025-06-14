//

import {DictionaryFont} from "/client/skeleton/dictionary/dictionary-font";
import {TemplateWord} from "/client/skeleton/word/template-word";


export interface DictionarySettings {

  akrantiainSource?: string;
  zatlinSource?: string;
  font?: DictionaryFont;
  templateWords: Array<TemplateWord>;
  punctuations: Array<string>;
  ignoredEquivalentPattern?: string;
  pronunciationTitle: string;
  exampleTitle: string;
  enableMarkdown: boolean;
  enableDuplicateName: boolean;
  showEquivalentNumber: boolean;

}