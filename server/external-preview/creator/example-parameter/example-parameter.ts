//

import type {
  NormalExampleParameter$In
} from "/server/external-preview/schema";
import {
  ExampleParameter,
  NormalExampleParameter
} from "/server/model";


export namespace ExampleParameterCreator {

  export function enflesh(object: NormalExampleParameter$In): ExampleParameter {
    const raw = new NormalExampleParameter(
      object.text,
      object.mode,
      object.type,
      {ignore: {case: object.ignoreCase}}
    );
    return raw;
  }

}