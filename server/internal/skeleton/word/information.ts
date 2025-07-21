//


export interface Information {

  title: string;
  text: string;

}


export namespace Information {

  export const EMPTY = {
    title: "",
    text: ""
  } satisfies Information;

}