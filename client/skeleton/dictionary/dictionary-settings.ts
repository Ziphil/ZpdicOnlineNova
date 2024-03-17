//

import {DictionaryFontCustomSettings} from "/client/skeleton/dictionary/dictionary-font-settings";


export interface DictionarySettings {

  akrantiainSource?: string;
  zatlinSource?: string;
  fontSettings?: DictionaryFontCustomSettings;
  punctuations: Array<string>;
  pronunciationTitle: string;
  exampleTitle: string;
  enableMarkdown: boolean;
  enableDuplicateName: boolean;

}