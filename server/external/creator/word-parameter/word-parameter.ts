//

import type {
  NormalWordParameter as NormalWordParameterObject
} from "/server/external/schema";
import {
  NormalWordParameter,
  WordParameter
} from "/server/model";


export namespace WordParameterCreator {

  export function enflesh(object: NormalWordParameterObject): WordParameter {
    const raw = new NormalWordParameter(
      object.text,
      object.mode ?? "name",
      object.type ?? "prefix",
      {mode: object.orderMode ?? "unicode", direction: object.orderDirection ?? "ascending"},
      {ignore: {case: false}, shuffleSeed: null, enableSuggestions: false}
    );
    return raw;
  }

}