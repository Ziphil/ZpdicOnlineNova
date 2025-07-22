//


export interface Phrase {

  titles: Array<string>;
  form: string;
  terms: Array<string>;
  termString: string;
  ignoredPattern?: string;

}


export namespace Phrase {

  export const EMPTY = {
    titles: [],
    form: "",
    terms: [],
    termString: ""
  } as Phrase;

}