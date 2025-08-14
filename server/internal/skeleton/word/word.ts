//

import {DateString, ObjectId} from "/server/internal/skeleton/common";
import {Example} from "/server/internal/skeleton/example/example";
import {Section} from "/server/internal/skeleton/word/section";


export interface EditableWord {

  number: number | null;
  spelling: string;
  pronunciation: string;
  tags: Array<string>;
  sections: Array<Section>;

}


export namespace EditableWord {

  export const EMPTY = {
    number: null,
    spelling: "",
    pronunciation: "",
    tags: [],
    sections: []
  } satisfies EditableWord;

}


export interface Word {

  id: ObjectId;
  number: number;
  spelling: string;
  pronunciation: string;
  tags: Array<string>;
  sections: Array<Section>;
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