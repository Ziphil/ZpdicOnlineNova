//

import {array, object, string} from "yup";


export const PHRASE = object({
  titles: array().of(string().defined()).default([]),
  form: string().default(""),
  translations: array().of(string().defined()).default([]),
  translationString: string().default(""),
  ignoredPattern: string().default("")
});


export interface Phrase {

  titles: Array<string>;
  form: string;
  translations: Array<string>;
  translationString: string;
  ignoredPattern: string;

}
