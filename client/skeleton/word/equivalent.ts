/* eslint-disable @typescript-eslint/no-namespace */


export interface Equivalent {

  titles: Array<string>;
  names: Array<string>;

}


export namespace Equivalent {

  export const EMPTY = {
    titles: [],
    names: []
  } satisfies Equivalent;

}