//


export interface Phrase {

  titles: Array<string>;
  spelling: string;
  terms: Array<string>;
  termString: string;
  ignoredPattern?: string;

}


export namespace Phrase {

  export const EMPTY = {
    titles: [],
    spelling: "",
    terms: [],
    termString: ""
  } as Phrase;

}