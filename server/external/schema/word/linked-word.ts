//

import {number, object} from "yup";


export const LINKED_WORD = object({
  number: number().required()
});


export interface LinkedWord {

  number: number;
  name?: string | null;

}