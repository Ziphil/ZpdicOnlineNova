//

import {Search} from "/client/hook/search";
import {ExactExampleParameter} from "/client/skeleton/example-parameter/exact-example-parameter";
import {NormalExampleParameter} from "/client/skeleton/example-parameter/normal-example-parameter";
import {LiteralType, LiteralUtilType} from "/server/util/literal-type";


export type ExampleParameter = NormalExampleParameter | ExactExampleParameter;

export const EXAMPLE_MODES = ["sentence", "translation", "both", "tag", "content"] as const;
export type ExampleMode = LiteralType<typeof EXAMPLE_MODES>;
export const ExampleModeUtil = LiteralUtilType.create(EXAMPLE_MODES);

export const EXAMPLE_TYPES = ["exact", "prefix", "suffix", "part", "regular"] as const;
export type ExampleType = LiteralType<typeof EXAMPLE_TYPES>;
export const ExampleTypeUtil = LiteralUtilType.create(EXAMPLE_TYPES);

export type ExampleIgnoreOptions = {case: boolean};


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

  export function toNormal(parameter: ExampleParameter): NormalExampleParameter {
    if (parameter.kind === "exact") {
      return NormalExampleParameter.EMPTY;
    } else {
      return parameter;
    }
  }

}