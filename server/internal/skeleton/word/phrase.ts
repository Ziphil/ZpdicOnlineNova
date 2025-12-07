//


export interface Phrase {

  titles: Array<string>;
  expression: string;
  terms: Array<string>;
  termString: string;
  ignoredPattern?: string;
  text: string;
  hidden: boolean;

}


export namespace Phrase {

  export const EMPTY = {
    titles: [],
    expression: "",
    terms: [],
    termString: "",
    text: "",
    hidden: false
  } as Phrase;

}