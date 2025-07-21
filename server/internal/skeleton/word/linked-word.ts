//


export interface LinkedWord {

  number: number;
  name?: string | null;

}


export namespace LinkedWord {

  export const EMPTY = {
    number: -1
  } as LinkedWord;

}