//

import {InferType, object, string} from "yup";


export const NormalExampleOfferParameter$In = object({

  catalog: string().defined()

});


export type NormalExampleOfferParameter$In = InferType<typeof NormalExampleOfferParameter$In>;