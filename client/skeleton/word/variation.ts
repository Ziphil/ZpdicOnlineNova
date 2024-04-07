//


export interface Variation {

  title: string;
  name: string;

}


export namespace Variation {

  export const EMPTY = {
    title: "",
    name: ""
  } satisfies Variation;

}