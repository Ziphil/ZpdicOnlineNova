//

import merge from "lodash.merge";
import {Search} from "/client/hook/search";


export interface NormalExampleParameter {

  kind: "normal";

}


export namespace NormalExampleParameter {

  export const EMPTY = {
    kind: "normal"
  } satisfies NormalExampleParameter;

  export function deserialize(search: Search): NormalExampleParameter {
    const parameter = merge({}, EMPTY, {});
    return parameter;
  }

  export function serialize(parameter: NormalExampleParameter): Search {
    const search = new URLSearchParams();
    return search;
  }

}