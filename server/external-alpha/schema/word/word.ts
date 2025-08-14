//

import {InferType, array, object, string} from "yup";
import {Example$Out} from "/server/external-alpha/schema/example/example";
import {Section$In, Section$Out} from "/server/external-alpha/schema/word/section";


export const EditableWord$In = object({

  spelling: string().defined(),
  pronunciation: string().default(""),
  tags: array().of(string().defined()).default([]),
  sections: array().of(Section$In.defined()).default([])

});


export interface Word$Out {

  id: string;
  number: number;
  spelling: string;
  pronunciation: string;
  tags: Array<string>;
  sections: Array<Section$Out>;

}


export interface WordWithExamples$Out extends Word$Out {

  examples: Array<Example$Out>;

}


export type EditableWord$In = InferType<typeof EditableWord$In>;