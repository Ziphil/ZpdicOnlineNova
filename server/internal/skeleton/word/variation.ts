//


export interface Variation {

  title: string;
  name: string;
  pronunciation: string;

}


export namespace Variation {

  export const EMPTY = {
    title: "",
    name: "",
    pronunciation: ""
  } satisfies Variation;

}