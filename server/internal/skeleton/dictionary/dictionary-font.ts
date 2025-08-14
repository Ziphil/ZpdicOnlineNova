//


export interface DictionaryFontNone {

  kind: "none";

}


export interface DictionaryFontLocal {

  kind: "local";
  name: string;

}


export interface DictionaryFontCustom {

  kind: "custom";
  name?: string;
  format: string;

}


export type DictionaryFont = DictionaryFontNone | DictionaryFontLocal | DictionaryFontCustom;