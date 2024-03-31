/* eslint-disable @typescript-eslint/no-namespace */

import {ObjectId} from "/client/skeleton/common";
import {Example} from "/client/skeleton/example/example";
import {Equivalent} from "/client/skeleton/word/equivalent";
import {Information} from "/client/skeleton/word/information";
import {Relation} from "/client/skeleton/word/relation";
import {Variation} from "/client/skeleton/word/variation";


export interface EditableWord {

  number?: number;
  name: string;
  pronunciation?: string;
  equivalents: Array<Equivalent>;
  tags: Array<string>;
  informations: Array<Information>;
  variations: Array<Variation>;
  relations: Array<Relation>;

}


export namespace EditableWord {

  export const EMPTY = {
    name: "",
    equivalents: [],
    tags: [],
    informations: [],
    variations: [],
    relations: []
  } satisfies EditableWord;

}


export interface Word extends EditableWord {

  id: ObjectId;
  number: number;
  createdDate?: string;
  updatedDate?: string;

}


export interface DetailedWord extends Word {

  examples: Array<Example>;

}