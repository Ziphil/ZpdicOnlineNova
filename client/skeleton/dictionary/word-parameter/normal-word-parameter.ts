//

import * as queryParser from "query-string";
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

  public search: string;
  public mode: WordMode;
  public type: WordType;
  public order: WordOrder;
  public ignoreOptions: WordIgnoreOptions;

  private constructor(search: string, mode: WordMode, type: WordType, order: WordOrder, ignoreOptions: WordIgnoreOptions) {
    super();
    this.search = search;
    this.mode = mode;
    this.type = type;
    this.order = order;
    this.ignoreOptions = ignoreOptions;
  }

  public static createEmpty(overrides: Partial<NormalWordParameter> = {}): NormalWordParameter {
    let search = overrides.search ?? "";
    let mode = overrides.mode ?? "both";
    let type = overrides.type ?? "prefix";
    let order = overrides.order ?? {mode: "unicode", direction: "ascending"};
    let ignoreOptions = overrides.ignoreOptions ?? {case: false};
    let skeleton = new NormalWordParameter(search, mode, type, order, ignoreOptions);
    return skeleton;
  }

  public static deserializeEach(searchObject: Record<string, unknown>): NormalWordParameter {
    let search = (typeof searchObject.search === "string") ? searchObject.search : undefined;
    let mode = (typeof searchObject.mode === "string") ? WordModeUtil.cast(searchObject.mode) : undefined;
    let type = (typeof searchObject.type === "string") ? WordTypeUtil.cast(searchObject.type) : undefined;
    let orderMode = (typeof searchObject.orderMode === "string") ? WordOrderModeUtil.cast(searchObject.orderMode) : undefined;
    let orderDirection = (typeof searchObject.orderDirection === "string") ? WordOrderDirectionUtil.cast(searchObject.orderDirection) : undefined;
    let order = (orderMode !== undefined && orderDirection !== undefined) ? {mode: orderMode, direction: orderDirection} : undefined;
    let ignoreOptions = (searchObject.ignoreCase === "true") ? {case: true} : undefined;
    let parameter = NormalWordParameter.createEmpty({search, mode, type, order, ignoreOptions});
    return parameter;
  }

  public serialize(): Record<string, unknown> {
    let search = this.search;
    let mode = this.mode;
    let type = this.type;
    let orderMode = this.order.mode;
    let orderDirection = this.order.direction;
    let ignoreCase = this.ignoreOptions.case;
    let searchObject = {search, mode, type, orderMode, orderDirection, ignoreCase};
    return searchObject;
  }

}