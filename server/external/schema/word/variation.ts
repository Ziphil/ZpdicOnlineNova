//

import {InferType, object, string} from "yup";


export const Variation$In = object({

  title: string().default(""),
  name: string().default(""),
  pronunciation: string().default("")

});


export interface Variation$Out {

  title: string;
  name: string;
  pronunciation: string;

}


export type Variation$In = InferType<typeof Variation$In>;