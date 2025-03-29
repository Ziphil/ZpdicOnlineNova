//

import {InferType, string} from "yup";


export const WordMode = string().oneOf(["name", "equivalent", "both", "tag", "information", "variation", "relation", "content"]);
export type WordMode = InferType<typeof WordMode>;

export const WordType = string().oneOf(["exact", "prefix", "suffix", "part", "regular"]);
export type WordType = InferType<typeof WordType>;

export const WordOrderDirection = string().oneOf(["ascending", "descending"]);
export type WordOrderDirection = InferType<typeof WordOrderDirection>;