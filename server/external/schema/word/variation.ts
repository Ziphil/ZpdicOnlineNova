//

import {object, string} from "yup";


export const VARIATION = object({
  title: string().default(""),
  name: string().default("")
});


export interface Variation {

  title: string;
  name: string;

}
