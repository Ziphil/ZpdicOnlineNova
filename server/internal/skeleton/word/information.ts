//


export interface Information {

  title: string;
  text: string;
  hidden: boolean;

}


export namespace Information {

  export const EMPTY = {
    title: "",
    text: "",
    hidden: false
  } satisfies Information;

}