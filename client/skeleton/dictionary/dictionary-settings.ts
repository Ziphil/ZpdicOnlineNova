//

import {DictionaryFont} from "/client/skeleton/dictionary/dictionary-font";


export interface DictionarySettings {

  akrantiainSource?: string;
  zatlinSource?: string;
  font?: DictionaryFont;
  punctuations: Array<string>;
  ignoredEquivalentPattern?: string;
  pronunciationTitle: string;
  exampleTitle: string;
  enableMarkdown: boolean;
  enableDuplicateName: boolean;
  showEquivalentNumber: boolean;

}