//

import {InferType, object, string} from "yup";


export const Variation$In = object({

  title: string().default(""),
  spelling: string().default(""),
  pronunciation: string().default("")

});


export interface Variation$Out {

  title: string;
  spelling: string;
  pronunciation: string;

}


export type Variation$In = InferType<typeof Variation$In>;