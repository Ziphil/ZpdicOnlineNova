//

import {InferType, number, object} from "yup";


export const LinkedWord$In = object({

  number: number().defined()

});


export interface LinkedWord$Out {

  number: number;

}


export type LinkedWord$In = InferType<typeof LinkedWord$In>;