//

import type {
  ExampleOfferParameter as ExampleOfferParameterSkeleton
} from "/client/skeleton";
import {
  ExampleOfferParameter,
  NormalExampleOfferParameter
} from "/server/model";


export namespace ExampleOfferParameterCreator {

  export function enflesh(skeleton: ExampleOfferParameterSkeleton): ExampleOfferParameter {
    const raw = new NormalExampleOfferParameter(skeleton.catalog);
    return raw;
  }

}