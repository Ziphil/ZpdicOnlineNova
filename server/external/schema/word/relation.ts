//

import {InferType, array, number, object, string} from "yup";


export const Relation$In = object({

  titles: array().of(string().defined()).default([]),
  number: number().defined(),
  name: string().defined()

});


export interface Relation$Out {

  titles: Array<string>;
  number: number;
  name: string;

}


export type Relation$In = InferType<typeof Relation$In>;