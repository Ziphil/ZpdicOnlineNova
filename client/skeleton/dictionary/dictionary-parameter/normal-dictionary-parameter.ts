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
  public userId: string | null;
  public order: DictionaryOrder;

  private constructor(text: string, userId: string | null, order: DictionaryOrder) {
    super();
    this.text = text;
    this.userId = userId;
    this.order = order;
  }

  public static createEmpty(overrides: DeepPartial<NormalDictionaryParameter> = {}): NormalDictionaryParameter {
    const {text, userId, order} = merge({
      text: "",
      userId: null,
      order: {mode: "updatedDate", direction: "descending"}
    }, overrides);
    const skeleton = new NormalDictionaryParameter(text, userId, order);
    return skeleton;
  }

  public static deserializeEach(search: Record<string, unknown>): NormalDictionaryParameter {
    const text = (typeof search.text === "string") ? search.text : undefined;
    const userId = (typeof search.userId === "string") ? search.userId : undefined;
    const orderMode = (typeof search.orderMode === "string") ? DictionaryOrderModeUtil.cast(search.orderMode) : undefined;
    const orderDirection = (typeof search.orderDirection === "string") ? DictionaryOrderDirectionUtil.cast(search.orderDirection) : undefined;
    const order = {mode: orderMode, direction: orderDirection};
    const parameter = NormalDictionaryParameter.createEmpty({text, userId, order});
    return parameter;
  }

  public serialize(): Record<string, unknown> {
    const text = this.text;
    const userId = this.userId;
    const orderMode = this.order.mode;
    const orderDirection = this.order.direction;
    const search = {text, userId, orderMode, orderDirection};
    return search;
  }

}