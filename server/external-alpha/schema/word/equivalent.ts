//

import {InferType, array, boolean, object, string} from "yup";


export const Equivalent$In = object({

  titles: array().of(string().defined()).default([]),
  terms: array().of(string().defined()).default([]),
  termString: string().default(""),
  ignoredPattern: string().default(""),
  hidden: boolean().default(false)

});


export interface Equivalent$Out {

  titles: Array<string>;
  terms: Array<string>;
  termString: string;
  ignoredPattern: string;
  hidden: boolean;

}


export type Equivalent$In = InferType<typeof Equivalent$In>;