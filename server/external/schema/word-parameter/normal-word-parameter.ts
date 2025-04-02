//

import {boolean, object, string} from "yup";
import {WORD_MODE, WORD_ORDER_DIRECTION, WORD_ORDER_MODE, WORD_TYPE} from "/server/external/schema/word-parameter/word-parameter";


export const NORMAL_WORD_PARAMETER = object({
  text: string().defined(),
  mode: WORD_MODE.default("both"),
  type: WORD_TYPE.default("prefix"),
  orderMode: WORD_ORDER_MODE.default("unicode"),
  orderDirection: WORD_ORDER_DIRECTION.default("ascending"),
  ignoreCase: boolean().default(false)
});