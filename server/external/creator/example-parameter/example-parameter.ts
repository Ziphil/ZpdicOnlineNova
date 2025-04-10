//

import {InferType} from "yup";
import type {
  NORMAL_EXAMPLE_PARAMETER
} from "/server/external/schema";
import {
  ExampleParameter,
  NormalExampleParameter
} from "/server/model";


export namespace ExampleParameterCreator {

  export function enflesh(object: InferType<typeof NORMAL_EXAMPLE_PARAMETER>): ExampleParameter {
    const raw = new NormalExampleParameter(
      object.text,
      object.mode,
      object.type,
      {ignore: {case: object.ignoreCase}}
    );
    return raw;
  }

}