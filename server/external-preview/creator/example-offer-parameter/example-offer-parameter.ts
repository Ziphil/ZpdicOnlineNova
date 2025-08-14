//

import type {
  NormalExampleOfferParameter$In
} from "/server/external-preview/schema";
import {
  ExampleOfferParameter,
  NormalExampleOfferParameter
} from "/server/model";


export namespace ExampleOfferParameterCreator {

  export function enflesh(skeleton: NormalExampleOfferParameter$In): ExampleOfferParameter {
    const raw = new NormalExampleOfferParameter(skeleton.catalog);
    return raw;
  }

}