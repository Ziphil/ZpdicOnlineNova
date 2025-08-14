//

import {InferType, boolean, object, string} from "yup";


export const Information$In = object({

  title: string().default(""),
  text: string().default(""),
  hidden: boolean().default(false)

});


export interface Information$Out {

  title: string;
  text: string;
  hidden: boolean;

}


export type Information$In = InferType<typeof Information$In>;