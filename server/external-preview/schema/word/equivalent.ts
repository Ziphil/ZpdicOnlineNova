//

import {InferType, array, boolean, object, string} from "yup";


export const Equivalent$In = object({

  titles: array().of(string().defined()).default([]),
  names: array().of(string().defined()).default([]),
  nameString: string().default(""),
  ignoredPattern: string().default(""),
  hidden: boolean().default(false)

});


export interface Equivalent$Out {

  titles: Array<string>;
  names: Array<string>;
  nameString: string;
  ignoredPattern: string;
  hidden: boolean;

}


export type Equivalent$In = InferType<typeof Equivalent$In>;