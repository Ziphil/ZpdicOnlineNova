/* eslint-disable @typescript-eslint/no-namespace */

import {Equivalent} from "/client-new/skeleton/word/equivalent";
import {Example} from "/client-new/skeleton/word/example";
import {Information} from "/client-new/skeleton/word/information";
import {Relation} from "/client-new/skeleton/word/relation";
import {Variation} from "/client-new/skeleton/word/variation";


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

  id: string;
  number: number;
  createdDate?: string;
  updatedDate?: string;

}


export interface DetailedWord extends Word {

  examples: Array<Example>;

}