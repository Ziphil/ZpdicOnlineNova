//

import {number, object} from "yup";


export const LINKED_WORD = object({
  number: number().defined()
});


export interface LinkedWord {

  number: number;
  name?: string | null;

}