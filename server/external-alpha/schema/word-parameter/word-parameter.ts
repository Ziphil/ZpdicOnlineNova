//

import {string} from "yup";


export const WordMode$In = string().oneOf(["spelling", "term", "both", "tag", "information", "variation", "relation", "content"]);

export const WordType$In = string().oneOf(["exact", "prefix", "suffix", "part", "regular"]);

export const WordOrderMode$In = string().oneOf(["unicode", "updatedDate", "createdDate"]);

export const WordOrederDirection$In = string().oneOf(["ascending", "descending"]);