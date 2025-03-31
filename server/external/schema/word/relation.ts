//

import {array, number, object, string} from "yup";


export const RELATION = object({
  titles: array().of(string().required()).default([]),
  number: number().required(),
  name: string().required()
});


export interface Relation {

  titles: Array<string>;
  number: number;
  name: string;

}
