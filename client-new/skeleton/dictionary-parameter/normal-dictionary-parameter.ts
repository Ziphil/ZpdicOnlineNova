/* eslint-disable @typescript-eslint/no-namespace */

import merge from "lodash-es/merge";
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

  export function deserialize(params: URLSearchParams): NormalDictionaryParameter {
    const text = (params.get("text") !== null) ? params.get("text") : undefined;
    const userName = (params.get("userName") !== null) ? params.get("userName") : undefined;
    const orderMode = (params.get("orderMode") !== null) ? DictionaryOrderModeUtil.cast(params.get("orderMode")) : undefined;
    const orderDirection = (params.get("orderDirection") !== null) ? DictionaryOrderDirectionUtil.cast(params.get("orderDirection")) : undefined;
    const order = {mode: orderMode, direction: orderDirection};
    const parameter = merge({}, EMPTY, {text, userName, order});
    return parameter;
  }

  export function serialize(parameter: NormalDictionaryParameter): URLSearchParams {
    const params = new URLSearchParams();
    params.set("text", parameter.text);
    if (parameter.userName !== null) {
      params.set("userName", parameter.userName);
    }
    params.set("orderMode", parameter.order.mode);
    params.set("orderDirection", parameter.order.direction);
    return params;
  }

}