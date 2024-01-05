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
    const userName = (params.get("user-name") !== null) ? params.get("user-name") : undefined;
    const orderMode = (params.get("order-mode") !== null) ? DictionaryOrderModeUtil.cast(params.get("order-mode")) : undefined;
    const orderDirection = (params.get("order-direction") !== null) ? DictionaryOrderDirectionUtil.cast(params.get("order-direction")) : undefined;
    const order = {mode: orderMode, direction: orderDirection};
    const parameter = merge(EMPTY, {text, userName, order});
    return parameter;
  }

  export function serialize(parameter: NormalDictionaryParameter): URLSearchParams {
    const params = new URLSearchParams();
    params.set("text", parameter.text);
    if (parameter.userName !== null) {
      params.set("user-name", parameter.userName);
    }
    params.set("order-mode", parameter.order.mode);
    params.set("order-direction", parameter.order.direction);
    return params;
  }

}