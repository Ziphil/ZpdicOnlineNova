//

import {number, object, string} from "yup";


export const LinkedExampleOffer$In = object({

  catalog: string().defined(),
  number: number().defined()

});


export interface LinkedExampleOffer$Out {

  catalog: string;
  number: number;

}