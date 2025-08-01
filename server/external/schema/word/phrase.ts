//

import {array, object, string} from "yup";


export const PHRASE = object({
  titles: array().of(string().defined()).default([]),
  form: string().default(""),
  terms: array().of(string().defined()).default([]),
  termString: string().default(""),
  ignoredPattern: string().default("")
});


export interface Phrase {

  titles: Array<string>;
  form: string;
  terms: Array<string>;
  termString: string;
  ignoredPattern: string;

}
