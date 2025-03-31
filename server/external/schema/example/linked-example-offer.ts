//

import {number, object, string} from "yup";


export const LINKED_EXAMPLE_OFFER = object({
  catalog: string().required(),
  number: number().required()
});


export interface LinkedExampleOffer {

  catalog: string;
  number: number;

}