//

import {InferType, array, boolean, object, string} from "yup";


export const Phrase$In = object({

  titles: array().of(string().defined()).default([]),
  expression: string().default(""),
  terms: array().of(string().defined()).default([]),
  termString: string().default(""),
  ignoredPattern: string().default(""),
  text: string().default(""),
  hidden: boolean().default(false)

});


export interface Phrase$Out {

  titles: Array<string>;
  expression: string;
  terms: Array<string>;
  termString: string;
  ignoredPattern: string;
  text: string;
  hidden: boolean;

}


export type Phrase$In = InferType<typeof Phrase$In>;