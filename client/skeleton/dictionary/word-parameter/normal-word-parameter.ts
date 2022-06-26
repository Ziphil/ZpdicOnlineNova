//

import merge from "lodash-es/merge";
import {
  DeepPartial
} from "ts-essentials";
import {
  WordMode,
  WordModeUtil,
  WordOrder,
  WordOrderDirectionUtil,
  WordOrderModeUtil,
  WordType,
  WordTypeUtil
} from "/client/skeleton/dictionary";
import {
  WordIgnoreOptions,
  WordParameter
} from "/client/skeleton/dictionary/word-parameter/word-parameter";


export class NormalWordParameter extends WordParameter {

  public text: string;
  public mode: WordMode;
  public type: WordType;
  public order: WordOrder;
  public options: NormalWordParameterOptions;

  private constructor(text: string, mode: WordMode, type: WordType, order: WordOrder, options: NormalWordParameterOptions) {
    super();
    this.text = text;
    this.mode = mode;
    this.type = type;
    this.order = order;
    this.options = options;
  }

  public static createEmpty(overrides: DeepPartial<NormalWordParameter> = {}): NormalWordParameter {
    const {text, mode, type, order, options} = merge({
      text: "",
      mode: "both",
      type: "prefix",
      order: {mode: "unicode", direction: "ascending"},
      options: {
        ignore: {case: false},
        randomSeed: null,
        enableSuggestions: false
      }
    }, overrides);
    const skeleton = new NormalWordParameter(text, mode, type, order, options);
    return skeleton;
  }

  public static deserializeEach(search: Record<string, unknown>): NormalWordParameter {
    const text = (typeof search.text === "string") ? search.text : (typeof search.search === "string") ? search.search : undefined;
    const mode = (typeof search.mode === "string") ? WordModeUtil.cast(search.mode) : undefined;
    const type = (typeof search.type === "string") ? WordTypeUtil.cast(search.type) : undefined;
    const orderMode = (typeof search.orderMode === "string") ? WordOrderModeUtil.cast(search.orderMode) : undefined;
    const orderDirection = (typeof search.orderDirection === "string") ? WordOrderDirectionUtil.cast(search.orderDirection) : undefined;
    const order = {mode: orderMode, direction: orderDirection};
    const ignoreCase = (search.ignoreCase === "true") ? true : undefined;
    const ignore = (ignoreCase !== undefined) ? {case: ignoreCase} : undefined;
    const randomSeed = (typeof search.randomSeed === "string") ? search.randomSeed : undefined;
    const enableSuggestions = (search.enableSuggestions === "true") ? true : undefined;
    const options = {ignore, randomSeed, enableSuggestions};
    const parameter = NormalWordParameter.createEmpty({text, mode, type, order, options});
    return parameter;
  }

  public serialize(): Record<string, unknown> {
    const text = this.text;
    const mode = this.mode;
    const type = this.type;
    const orderMode = this.order.mode;
    const orderDirection = this.order.direction;
    const ignoreCase = this.options.ignore.case;
    const randomSeed = this.options.randomSeed ?? undefined;
    const enableSuggestions = this.options.enableSuggestions;
    const search = {text, mode, type, orderMode, orderDirection, ignoreCase, randomSeed, enableSuggestions};
    return search;
  }

}


export type NormalWordParameterOptions = {
  ignore: WordIgnoreOptions,
  randomSeed: string | null,
  enableSuggestions: boolean
};