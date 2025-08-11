//

import type {
  NormalWordParameter$In
} from "/server/external-preview/schema";
import {
  NormalWordParameter,
  WordParameter
} from "/server/model";


export namespace WordParameterCreator {

  export function enflesh(object: NormalWordParameter$In): WordParameter {
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