//

import {string} from "yup";


export const WORD_MODE = string().oneOf(["name", "equivalent", "both", "tag", "information", "variation", "relation", "content"]);

export const WORD_TYPE = string().oneOf(["exact", "prefix", "suffix", "part", "regular"]);

export const WORD_ORDER_MODE = string().oneOf(["unicode", "updatedDate", "createdDate"]);

export const WORD_ORDER_DIRECTION = string().oneOf(["ascending", "descending"]);