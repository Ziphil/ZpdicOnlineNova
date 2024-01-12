/* eslint-disable @typescript-eslint/no-namespace */

import {LinkedWord} from "/client-new/skeleton/word/linked-word";


export interface EditableExample {

  number?: number;
  words: Array<LinkedWord>;
  sentence: string;
  translation: string;

}


export namespace EditableExample {

  export const EMPTY = {
    words: [],
    sentence: "",
    translation: ""
  } as EditableExample;

}


export interface Example extends EditableExample {

  id: string;
  number: number;

}