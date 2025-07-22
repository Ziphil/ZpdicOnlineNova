//

import {Search} from "/client/hook/search";


export interface ExactExampleParameter {

  kind: "exact";
  number: number;

}


export namespace ExactExampleParameter {

  export function deserialize(search: Search): ExactExampleParameter {
    const number = (search.has("number")) ? +search.get("number")! : 0;
    const parameter = {kind: "exact", number} satisfies ExactExampleParameter;
    return parameter;
  }

  export function serialize(parameter: ExactExampleParameter): Search {
    const search = new URLSearchParams();
    search.set("kind", "exact");
    search.set("number", parameter.number.toString());
    return search;
  }

}