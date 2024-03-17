//


export interface DictionaryFontLocalSettings {

  type: "local";
  name: string;

}


export interface DictionaryFontCustomSettings {

  type: "custom";

}


export type DictionaryFontSettings = DictionaryFontLocalSettings | DictionaryFontCustomSettings;