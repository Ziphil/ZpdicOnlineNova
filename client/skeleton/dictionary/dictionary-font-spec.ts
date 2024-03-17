//


export interface DictionaryFontLocalSpec {

  type: "local";
  name: string;

}


export interface DictionaryFontCustomSpec {

  type: "custom";

}


export type DictionaryFontSpec = DictionaryFontLocalSpec | DictionaryFontCustomSpec;