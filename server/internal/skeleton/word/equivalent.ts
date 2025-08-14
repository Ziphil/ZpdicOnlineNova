//


export interface Equivalent {

  titles: Array<string>;
  terms: Array<string>;
  termString: string;
  ignoredPattern?: string;
  hidden: boolean;

}


export namespace Equivalent {

  export const EMPTY = {
    titles: [],
    terms: [],
    termString: "",
    hidden: false
  } satisfies Equivalent;

}