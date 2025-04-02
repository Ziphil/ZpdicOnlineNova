//

import {array, object, string} from "yup";


export const EQUIVALENT = object({
  titles: array().of(string().defined()).default([]),
  names: array().of(string().defined()).default([]),
  nameString: string().default(""),
  ignoredPattern: string()
});


export interface Equivalent {

  titles: Array<string>;
  names: Array<string>;
  nameString: string;
  ignoredPattern: string;

}