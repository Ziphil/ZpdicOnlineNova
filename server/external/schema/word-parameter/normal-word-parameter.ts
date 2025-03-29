//

import {InferType, object, string} from "yup";
import {WordMode, WordOrderDirection, WordOrderMode, WordType} from "/server/external/schema/word-parameter/word-parameter";


export const NormalWordParameter = object({
  text: string().required(),
  mode: WordMode,
  type: WordType,
  orderMode: WordOrderMode,
  orderDirection: WordOrderDirection
});
export type NormalWordParameter = InferType<typeof NormalWordParameter>;