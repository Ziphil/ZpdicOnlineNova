//

import {InferType, array, object, string} from "yup";
import {Example$Out} from "/server/external-preview/schema/example/example";
import {Equivalent$In, Equivalent$Out} from "/server/external-preview/schema/word/equivalent";
import {Information$In, Information$Out} from "/server/external-preview/schema/word/information";
import {Phrase$In, Phrase$Out} from "/server/external-preview/schema/word/phrase";
import {Relation$In, Relation$Out} from "/server/external-preview/schema/word/relation";
import {Variation$In, Variation$Out} from "/server/external-preview/schema/word/variation";


export const EditableWord$In = object({

  name: string().defined(),
  pronunciation: string().default(""),
  equivalents: array().of(Equivalent$In.defined()).default([]),
  tags: array().of(string().defined()).default([]),
  informations: array().of(Information$In.defined()).default([]),
  phrases: array().of(Phrase$In.defined()).default([]),
  variations: array().of(Variation$In.defined()).default([]),
  relations: array().of(Relation$In.defined()).default([])

});


export interface Word$Out {

  id: string;
  number: number;
  name: string;
  pronunciation: string;
  equivalents: Array<Equivalent$Out>;
  tags: Array<string>;
  informations: Array<Information$Out>;
  phrases: Array<Phrase$Out>;
  variations: Array<Variation$Out>;
  relations: Array<Relation$Out>;

}


export interface WordWithExamples$Out extends Word$Out {

  examples: Array<Example$Out>;

}


export type EditableWord$In = InferType<typeof EditableWord$In>;