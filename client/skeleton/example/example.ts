/* eslint-disable @typescript-eslint/no-namespace */

import {ObjectId} from "/client/skeleton/common";
import {LinkedWord} from "/client/skeleton/word/linked-word";


export interface EditableExample {

  number?: number;
  sentence: string;
  translation: string;
  words: Array<LinkedWord>;
  offer?: ObjectId;

}


export namespace EditableExample {

  export const EMPTY = {
    words: [],
    sentence: "",
    translation: ""
  } as EditableExample;

}


export interface Example extends EditableExample {

  id: ObjectId;
  number: number;

}