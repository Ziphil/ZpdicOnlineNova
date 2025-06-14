//

import {Dictionary} from "/client/skeleton";
import {DateString, ObjectId} from "/client/skeleton/common";
import {LinkedExampleOffer} from "/client/skeleton/example/linked-example-offer";
import {LinkedWord} from "/client/skeleton/word/linked-word";


export interface EditableExample {

  number: number | null;
  sentence: string;
  translation: string;
  supplement?: string;
  tags: Array<string>;
  words: Array<LinkedWord>;
  offer: LinkedExampleOffer | null;

}


export namespace EditableExample {

  export const EMPTY = {
    number: null,
    words: [],
    sentence: "",
    translation: "",
    supplement: "",
    tags: [],
    offer: null
  } as EditableExample;

}


export interface Example {

  id: ObjectId;
  number: number;
  sentence: string;
  translation: string;
  supplement?: string;
  tags: Array<string>;
  words: Array<LinkedWord>;
  offer: LinkedExampleOffer | null;
  updatedUser?: {id: ObjectId};
  createdDate?: DateString;
  updatedDate?: DateString;

}


export interface ExampleWithDictionary extends Example {

  dictionary: Dictionary;

}