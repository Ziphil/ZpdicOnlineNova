//

import {DictionaryFontSpec} from "/client/skeleton/dictionary/dictionary-font-spec";


export interface DictionarySettings {

  akrantiainSource?: string;
  zatlinSource?: string;
  fontSpec?: DictionaryFontSpec;
  punctuations: Array<string>;
  pronunciationTitle: string;
  exampleTitle: string;
  enableMarkdown: boolean;
  enableDuplicateName: boolean;

}