//

import {boolean, object, string} from "yup";
import {EXAMPLE_MODE, EXAMPLE_TYPE} from "/server/external/schema/example-parameter/example-parameter";


export const NORMAL_EXAMPLE_PARAMETER = object({
  text: string().defined(),
  mode: EXAMPLE_MODE.default("both"),
  type: EXAMPLE_TYPE.default("prefix"),
  ignoreCase: boolean().default(false)
});