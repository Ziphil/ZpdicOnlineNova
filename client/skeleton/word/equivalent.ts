//


export interface Equivalent {

  titles: Array<string>;
  names: Array<string>;
  nameString: string;

}


export namespace Equivalent {

  export const EMPTY = {
    titles: [],
    names: [],
    nameString: ""
  } satisfies Equivalent;

}