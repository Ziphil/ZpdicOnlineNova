//

import {InferType} from "yup";
import type {
  NORMAL_WORD_PARAMETER
} from "/server/external/schema";
import {
  NormalWordParameter,
  WordParameter
} from "/server/model";


export namespace WordParameterCreator {

  export function enflesh(object: InferType<typeof NORMAL_WORD_PARAMETER>): WordParameter {
    const raw = new NormalWordParameter(
      object.text,
      object.mode,
      object.type,
      {mode: object.orderMode, direction: object.orderDirection},
      {ignore: {case: object.ignoreCase}, shuffleSeed: null, enableSuggestions: false}
    );
    return raw;
  }

}