//

import merge from "lodash.merge";
import {Search} from "/client/hook/search";


export interface NormalExampleOfferParameter {

  kind: "normal";
  catalog: string | null;

}


export namespace NormalExampleOfferParameter {

  export const EMPTY = {
    kind: "normal",
    catalog: null
  } satisfies NormalExampleOfferParameter;
  export const DAILY = {
    kind: "normal",
    catalog: "zpdicDaily"
  } satisfies NormalExampleOfferParameter;

  export function deserialize(search: Search): NormalExampleOfferParameter {
    const catalog = (search.has("catalog")) ? search.get("catalog") : undefined;
    const parameter = merge({}, DAILY, {catalog});
    return parameter;
  }

  export function serialize(parameter: NormalExampleOfferParameter): Search {
    const search = new URLSearchParams();
    if (parameter.catalog !== null) {
      search.set("catalog", parameter.catalog);
    }
    return search;
  }

}