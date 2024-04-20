//

import {Dictionary} from "/client/skeleton";
import {ObjectId} from "/client/skeleton/common";
import {LinkedWord} from "/client/skeleton/word/linked-word";


export interface EditableExample {

  number?: number;
  sentence: string;
  translation: string;
  supplement?: string;
  words: Array<LinkedWord>;
  offer?: ObjectId;

}


export namespace EditableExample {

  export const EMPTY = {
    words: [],
    sentence: "",
    translation: "",
    supplement: ""
  } as EditableExample;

}


export interface Example {

  id: ObjectId;
  number: number;
  sentence: string;
  translation: string;
  supplement?: string;
  words: Array<LinkedWord>;
  offer?: ObjectId;

}


export interface ExampleWithDictionary extends Example {

  dictionary: Dictionary;

}