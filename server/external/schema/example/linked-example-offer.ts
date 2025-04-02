//

import {number, object, string} from "yup";


export const LINKED_EXAMPLE_OFFER = object({
  catalog: string().defined(),
  number: number().defined()
});


export interface LinkedExampleOffer {

  catalog: string;
  number: number;

}