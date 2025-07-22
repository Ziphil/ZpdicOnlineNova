//

import {Search} from "/client/hook/search";
import {NormalExampleOfferParameter} from "/server/internal/skeleton/example-offer-parameter/normal-example-offer-parameter";


export type ExampleOfferParameter = NormalExampleOfferParameter;


export namespace ExampleOfferParameter {

  export function deserialize(search: Search): ExampleOfferParameter {
    return NormalExampleOfferParameter.deserialize(search);
  }

  export function serialize(parameter: ExampleOfferParameter): Search {
    return NormalExampleOfferParameter.serialize(parameter);
  }

}