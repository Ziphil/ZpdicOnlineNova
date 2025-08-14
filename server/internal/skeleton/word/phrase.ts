//


export interface Phrase {

  titles: Array<string>;
  expression: string;
  terms: Array<string>;
  termString: string;
  ignoredPattern?: string;

}


export namespace Phrase {

  export const EMPTY = {
    titles: [],
    expression: "",
    terms: [],
    termString: ""
  } as Phrase;

}