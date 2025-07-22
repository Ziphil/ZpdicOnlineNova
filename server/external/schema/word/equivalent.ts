//

import {array, boolean, object, string} from "yup";


export const EQUIVALENT = object({
  titles: array().of(string().defined()).default([]),
  names: array().of(string().defined()).default([]),
  nameString: string().default(""),
  ignoredPattern: string().default(""),
  hidden: boolean().default(false)
});


export interface Equivalent {

  titles: Array<string>;
  names: Array<string>;
  nameString: string;
  ignoredPattern: string;
  hidden: boolean;

}