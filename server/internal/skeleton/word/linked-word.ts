//


export interface LinkedWord {

  number: number;
  spelling?: string | null;

}


export namespace LinkedWord {

  export const EMPTY = {
    number: -1
  } as LinkedWord;

}