//

import {array, object, string} from "yup";


export const EQUIVALENT = object({
  titles: array().of(string().required()).default([]),
  names: array().of(string().required()).default([]),
  nameString: string().required().default(""),
  ignoredPattern: string()
});


export interface Equivalent {

  titles: Array<string>;
  names: Array<string>;
  nameString: string;
  ignoredPattern: string;

}