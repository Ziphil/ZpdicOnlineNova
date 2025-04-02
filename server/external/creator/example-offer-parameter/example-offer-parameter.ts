//

import {InferType} from "yup";
import type {
  NORMAL_EXAMPLE_OFFER_PARAMETER
} from "/server/external/schema";
import {
  ExampleOfferParameter,
  NormalExampleOfferParameter
} from "/server/model";


export namespace ExampleOfferParameterCreator {

  export function enflesh(skeleton: InferType<typeof NORMAL_EXAMPLE_OFFER_PARAMETER>): ExampleOfferParameter {
    const raw = new NormalExampleOfferParameter(skeleton.catalog);
    return raw;
  }

}