//

import merge from "lodash-es/merge";
import {
  DeepPartial
} from "ts-essentials";
import {
  DictionaryOrder,
  DictionaryOrderDirectionUtil,
  DictionaryOrderModeUtil
} from "/client/skeleton/dictionary";
import {
  DictionaryParameter
} from "/client/skeleton/dictionary/dictionary-parameter/dictionary-parameter";


export class NormalDictionaryParameter extends DictionaryParameter {

  public text: string;
  public userName: string | null;
  public order: DictionaryOrder;

  private constructor(text: string, userName: string | null, order: DictionaryOrder) {
    super();
    this.text = text;
    this.userName = userName;
    this.order = order;
  }

  public static createEmpty(overrides: DeepPartial<NormalDictionaryParameter> = {}): NormalDictionaryParameter {
    const {text, userName, order} = merge({
      text: "",
      userName: null,
      order: {mode: "updatedDate", direction: "descending"}
    }, overrides);
    const skeleton = new NormalDictionaryParameter(text, userName, order);
    return skeleton;
  }

  public static deserializeEach(search: Record<string, unknown>): NormalDictionaryParameter {
    const text = (typeof search.text === "string") ? search.text : undefined;
    const userName = (typeof search.userName === "string") ? search.userName : undefined;
    const orderMode = (typeof search.orderMode === "string") ? DictionaryOrderModeUtil.cast(search.orderMode) : undefined;
    const orderDirection = (typeof search.orderDirection === "string") ? DictionaryOrderDirectionUtil.cast(search.orderDirection) : undefined;
    const order = {mode: orderMode, direction: orderDirection};
    const parameter = NormalDictionaryParameter.createEmpty({text, userName, order});
    return parameter;
  }

  public serialize(): Record<string, unknown> {
    const text = this.text;
    const userName = this.userName;
    const orderMode = this.order.mode;
    const orderDirection = this.order.direction;
    const search = {text, userName, orderMode, orderDirection};
    return search;
  }

}