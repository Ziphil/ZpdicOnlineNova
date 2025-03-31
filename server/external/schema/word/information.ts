//

import {object, string} from "yup";


export const INFORMATION = object({
  title: string().default(""),
  text: string().default("")
});


export interface Information {

  title: string;
  text: string;

}