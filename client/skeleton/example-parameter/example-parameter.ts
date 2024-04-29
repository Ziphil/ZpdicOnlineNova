//

import {Search} from "/client/hook/search";
import {ExactExampleParameter} from "/client/skeleton/example-parameter/exact-example-parameter";
import {NormalExampleParameter} from "/client/skeleton/example-parameter/normal-example-parameter";


export type ExampleParameter = NormalExampleParameter | ExactExampleParameter;


export namespace ExampleParameter {

  export function deserialize(search: Search): ExampleParameter {
    if (search.get("kind") === "exact") {
      return ExactExampleParameter.deserialize(search);
    } else {
      return NormalExampleParameter.deserialize(search);
    }
  }

  export function serialize(parameter: ExampleParameter): Search {
    if (parameter.kind === "exact") {
      return ExactExampleParameter.serialize(parameter);
    } else {
      return NormalExampleParameter.serialize(parameter);
    }
  }

}