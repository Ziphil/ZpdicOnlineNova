//

import {InferType, boolean, object, string} from "yup";
import {WordMode$In, WordOrderMode$In, WordOrederDirection$In, WordType$In} from "/server/external-preview/schema/word-parameter/word-parameter";


export const NormalWordParameter$In = object({

  text: string().defined(),
  mode: WordMode$In.default("both"),
  type: WordType$In.default("prefix"),
  orderMode: WordOrderMode$In.default("unicode"),
  orderDirection: WordOrederDirection$In.default("ascending"),
  ignoreCase: boolean().default(false)

});


export type NormalWordParameter$In = InferType<typeof NormalWordParameter$In>;