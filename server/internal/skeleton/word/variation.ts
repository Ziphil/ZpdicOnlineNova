//


export interface Variation {

  title: string;
  spelling: string;
  pronunciation: string;

}


export namespace Variation {

  export const EMPTY = {
    title: "",
    spelling: "",
    pronunciation: ""
  } satisfies Variation;

}