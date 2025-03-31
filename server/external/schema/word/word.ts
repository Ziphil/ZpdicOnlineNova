//

import {array, object, string} from "yup";
import {Example} from "/server/external/schema/example/example";
import {EQUIVALENT, Equivalent} from "/server/external/schema/word/equivalent";
import {INFORMATION, Information} from "/server/external/schema/word/information";
import {RELATION, Relation} from "/server/external/schema/word/relation";
import {VARIATION, Variation} from "/server/external/schema/word/variation";


export const EDITABLE_WORD = object({
  name: string().required(),
  pronunciation: string(),
  equivalents: array().of(EQUIVALENT).default([]),
  tags: array().of(string()).default([]),
  informations: array().of(INFORMATION).default([]),
  variations: array().of(VARIATION).default([]),
  relations: array().of(RELATION).default([])
});


export interface Word {

  id: string;
  number: number;
  name: string;
  pronunciation: string;
  equivalents: Array<Equivalent>;
  tags: Array<string>;
  informations: Array<Information>;
  variations: Array<Variation>;
  relations: Array<Relation>;

}


export interface WordWithExamples extends Word {

  examples: Array<Example>;

}