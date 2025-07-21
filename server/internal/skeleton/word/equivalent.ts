//


export interface Equivalent {

  titles: Array<string>;
  names: Array<string>;
  nameString: string;
  ignoredPattern?: string;
  hidden: boolean;

}


export namespace Equivalent {

  export const EMPTY = {
    titles: [],
    names: [],
    nameString: "",
    hidden: false
  } satisfies Equivalent;

}