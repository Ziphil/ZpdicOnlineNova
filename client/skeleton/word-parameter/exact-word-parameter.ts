/* eslint-disable @typescript-eslint/no-namespace */

import {Search} from "/client/hook/search";


export interface ExactWordParameter {

  kind: "exact";
  number: number;

}


export namespace ExactWordParameter {

  export function deserialize(search: Search): ExactWordParameter {
    const number = (search.has("number")) ? +search.get("number")! : 0;
    const parameter = {kind: "exact", number} satisfies ExactWordParameter;
    return parameter;
  }

  export function serialize(parameter: ExactWordParameter): Search {
    const search = new URLSearchParams();
    search.set("kind", "exact");
    search.set("number", parameter.number.toString());
    return search;
  }

}