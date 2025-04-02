//

import {array, number, object, string} from "yup";


export const RELATION = object({
  titles: array().of(string().defined()).default([]),
  number: number().defined(),
  name: string().defined()
});


export interface Relation {

  titles: Array<string>;
  number: number;
  name: string;

}
