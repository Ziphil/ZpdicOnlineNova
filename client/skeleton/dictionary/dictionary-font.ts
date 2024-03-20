//


export interface DictionaryFontNone {

  type: "none";

}


export interface DictionaryFontLocal {

  type: "local";
  name: string;

}


export interface DictionaryFontCustom {

  type: "custom";
  name?: string;
  format: string;

}


export type DictionaryFont = DictionaryFontNone | DictionaryFontLocal | DictionaryFontCustom;