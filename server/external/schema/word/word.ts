//

import {array, object, string} from "yup";
import {Example} from "/server/external/schema/example/example";
import {EQUIVALENT, Equivalent} from "/server/external/schema/word/equivalent";
import {INFORMATION, Information} from "/server/external/schema/word/information";
import {PHRASE, Phrase} from "/server/external/schema/word/phrase";
import {RELATION, Relation} from "/server/external/schema/word/relation";
import {VARIATION, Variation} from "/server/external/schema/word/variation";


export const EDITABLE_WORD = object({
  name: string().defined(),
  pronunciation: string().default(""),
  equivalents: array().of(EQUIVALENT.defined()).default([]),
  tags: array().of(string().defined()).default([]),
  informations: array().of(INFORMATION.defined()).default([]),
  phrases: array().of(PHRASE.defined()).default([]),
  variations: array().of(VARIATION.defined()).default([]),
  relations: array().of(RELATION.defined()).default([])
});


export interface Word {

  id: string;
  number: number;
  name: string;
  pronunciation: string;
  equivalents: Array<Equivalent>;
  tags: Array<string>;
  informations: Array<Information>;
  phrases: Array<Phrase>;
  variations: Array<Variation>;
  relations: Array<Relation>;

}


export interface WordWithExamples extends Word {

  examples: Array<Example>;

}