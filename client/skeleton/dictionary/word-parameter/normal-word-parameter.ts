//

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
  public ignoreOptions: WordIgnoreOptions;

  private constructor(text: string, mode: WordMode, type: WordType, order: WordOrder, ignoreOptions: WordIgnoreOptions) {
    super();
    this.text = text;
    this.mode = mode;
    this.type = type;
    this.order = order;
    this.ignoreOptions = ignoreOptions;
  }

  public static createEmpty(overrides: Partial<NormalWordParameter> = {}): NormalWordParameter {
    let text = overrides.text ?? "";
    let mode = overrides.mode ?? "both";
    let type = overrides.type ?? "prefix";
    let order = overrides.order ?? {mode: "unicode", direction: "ascending"};
    let ignoreOptions = overrides.ignoreOptions ?? {case: false};
    let skeleton = new NormalWordParameter(text, mode, type, order, ignoreOptions);
    return skeleton;
  }

  public static deserializeEach(search: Record<string, unknown>): NormalWordParameter {
    let text = (typeof search.text === "string") ? search.text : (typeof search.search === "string") ? search.search : undefined;
    let mode = (typeof search.mode === "string") ? WordModeUtil.cast(search.mode) : undefined;
    let type = (typeof search.type === "string") ? WordTypeUtil.cast(search.type) : undefined;
    let orderMode = (typeof search.orderMode === "string") ? WordOrderModeUtil.cast(search.orderMode) : undefined;
    let orderDirection = (typeof search.orderDirection === "string") ? WordOrderDirectionUtil.cast(search.orderDirection) : undefined;
    let order = (orderMode !== undefined && orderDirection !== undefined) ? {mode: orderMode, direction: orderDirection} : undefined;
    let ignoreOptions = (search.ignoreCase === "true") ? {case: true} : undefined;
    let parameter = NormalWordParameter.createEmpty({text, mode, type, order, ignoreOptions});
    return parameter;
  }

  public serialize(): Record<string, unknown> {
    let text = this.text;
    let mode = this.mode;
    let type = this.type;
    let orderMode = this.order.mode;
    let orderDirection = this.order.direction;
    let ignoreCase = this.ignoreOptions.case;
    let search = {text, mode, type, orderMode, orderDirection, ignoreCase};
    return search;
  }

}