//

import {InferType, number, object, string} from "yup";


export const LinkedExampleOffer$In = object({

  catalog: string().default(""),
  number: number().defined()

});


export interface LinkedExampleOffer$Out {

  catalog: string;
  number: number;

}


export type LinkedExampleOffer$In = InferType<typeof LinkedExampleOffer$In>;
