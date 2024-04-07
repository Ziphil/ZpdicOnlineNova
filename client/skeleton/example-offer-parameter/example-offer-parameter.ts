//

import {Search} from "/client/hook/search";
import {NormalExampleOfferParameter} from "/client/skeleton/example-offer-parameter/normal-example-offer-parameter";


export type ExampleOfferParameter = NormalExampleOfferParameter;


export namespace ExampleOfferParameter {

  export function deserialize(search: Search): ExampleOfferParameter {
    const parameter = NormalExampleOfferParameter.deserialize(search);
    return parameter;
  }

  export function serialize(parameter: ExampleOfferParameter): Search {
    const params = NormalExampleOfferParameter.serialize(parameter);
    return params;
  }

}