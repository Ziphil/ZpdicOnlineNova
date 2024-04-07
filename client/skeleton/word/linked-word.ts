//


export interface LinkedWord {

  number: number;
  name?: string;

}


export namespace LinkedWord {

  export const EMPTY = {
    number: -1
  } as LinkedWord;

}