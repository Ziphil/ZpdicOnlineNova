//

import {DateString, ObjectId} from "/server/internal/skeleton/common";
import {Example} from "/server/internal/skeleton/example/example";
import {Equivalent} from "/server/internal/skeleton/word/equivalent";
import {Information} from "/server/internal/skeleton/word/information";
import {Phrase} from "/server/internal/skeleton/word/phrase";
import {Relation} from "/server/internal/skeleton/word/relation";
import {Variation} from "/server/internal/skeleton/word/variation";


export interface EditableWord {

  number: number | null;
  name: string;
  pronunciation: string;
  equivalents: Array<Equivalent>;
  tags: Array<string>;
  informations: Array<Information>;
  phrases: Array<Phrase>;
  variations: Array<Variation>;
  relations: Array<Relation>;

}


export namespace EditableWord {

  export const EMPTY = {
    number: null,
    name: "",
    pronunciation: "",
    equivalents: [],
    tags: [],
    informations: [],
    phrases: [],
    variations: [],
    relations: []
  } satisfies EditableWord;

}


export interface Word {

  id: ObjectId;
  number: number;
  name: string;
  pronunciation: string;
  equivalents: Array<Equivalent>;
  tags: Array<string>;
  informations: Array<Information>;
  phrases: Array<Phrase>;
  variations: Array<Variation>;
  relations: Array<Relation>;
  updatedUser?: {id: ObjectId};
  createdDate?: DateString;
  updatedDate?: DateString;

}


export interface OldWord extends Word {

  precedence: number;

}


export interface WordWithExamples extends Word {

  examples: Array<Example>;

}