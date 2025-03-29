//

import {InferType, object, string} from "yup";
import {WordMode, WordOrderDirection, WordType} from "/server/external/schema/word-parameter/word-parameter";


export const NormalWordParameter = object({
  text: string().required(),
  mode: WordMode.default("both"),
  type: WordType.default("prefix"),
  orderDirection: WordOrderDirection.default("ascending")
});
export type NormalWordParameter = InferType<typeof NormalWordParameter>;