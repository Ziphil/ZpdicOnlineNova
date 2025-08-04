//

import {InferType, boolean, object, string} from "yup";
import {ExampleMode$In, ExampleType$In} from "/server/external/schema/example-parameter/example-parameter";


export const NormalExampleParameter$In = object({

  text: string().defined(),
  mode: ExampleMode$In.default("both"),
  type: ExampleType$In.default("prefix"),
  ignoreCase: boolean().default(false)

});


export type NormalExampleParameter$In = InferType<typeof NormalExampleParameter$In>;