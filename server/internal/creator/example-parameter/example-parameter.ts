//

import type {
  ExampleParameter as ExampleParameterSkeleton
} from "/client/skeleton";
import {
  ExactExampleParameter,
  ExampleParameter,
  NormalExampleParameter
} from "/server/model";


export namespace ExampleParameterCreator {

  export function enflesh(skeleton: ExampleParameterSkeleton): ExampleParameter {
    if (skeleton.kind === "exact") {
      const raw = new ExactExampleParameter(skeleton.number);
      return raw;
    } else {
      const raw = new NormalExampleParameter();
      return raw;
    }
  }

}