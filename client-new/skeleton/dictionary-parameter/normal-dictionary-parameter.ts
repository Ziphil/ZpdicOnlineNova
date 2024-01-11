/* eslint-disable @typescript-eslint/no-namespace */

import merge from "lodash-es/merge";
import type {Search} from "/client-new/hook/search";
import {DictionaryOrder, DictionaryOrderDirectionUtil, DictionaryOrderModeUtil} from "/client-new/skeleton/dictionary-parameter/dictionary-parameter";


export interface NormalDictionaryParameter {

  text: string;
  userName: string | null;
  order: DictionaryOrder;

}


export namespace NormalDictionaryParameter {

  export const EMPTY = {
    text: "",
    userName: null,
    order: {mode: "updatedDate", direction: "descending"}
  } satisfies NormalDictionaryParameter;

  export function deserialize(search: Search): NormalDictionaryParameter {
    const text = (search.has("text")) ? search.get("text") : undefined;
    const userName = (search.has("userName")) ? search.get("userName") : undefined;
    const orderMode = (search.has("orderMode")) ? DictionaryOrderModeUtil.cast(search.get("orderMode")) : undefined;
    const orderDirection = (search.has("orderDirection")) ? DictionaryOrderDirectionUtil.cast(search.get("orderDirection")) : undefined;
    const order = {mode: orderMode, direction: orderDirection};
    const parameter = merge({}, EMPTY, {text, userName, order});
    return parameter;
  }

  export function serialize(parameter: NormalDictionaryParameter): Search {
    const search = new URLSearchParams();
    search.set("text", parameter.text);
    if (parameter.userName !== null) {
      search.set("userName", parameter.userName);
    }
    search.set("orderMode", parameter.order.mode);
    search.set("orderDirection", parameter.order.direction);
    return search;
  }

}