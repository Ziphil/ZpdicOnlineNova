//

import {boolean, object, string} from "yup";


export const INFORMATION = object({
  title: string().default(""),
  text: string().default(""),
  hidden: boolean().default(false)
});


export interface Information {

  title: string;
  text: string;
  hidden: boolean;

}