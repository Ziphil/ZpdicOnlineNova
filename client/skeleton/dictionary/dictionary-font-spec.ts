//


export interface DictionaryFontNoneSpec {

  type: "none";

}


export interface DictionaryFontLocalSpec {

  type: "local";
  name: string;

}


export interface DictionaryFontCustomSpec {

  type: "custom";
  format: string;

}


export type DictionaryFontSpec = DictionaryFontNoneSpec | DictionaryFontLocalSpec | DictionaryFontCustomSpec;