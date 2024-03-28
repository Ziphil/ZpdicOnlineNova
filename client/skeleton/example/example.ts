/* eslint-disable @typescript-eslint/no-namespace */

import {LinkedWord} from "/client/skeleton/word/linked-word";


export interface EditableExample {

  number?: number;
  sentence: string;
  translation: string;
  words: Array<LinkedWord>;

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