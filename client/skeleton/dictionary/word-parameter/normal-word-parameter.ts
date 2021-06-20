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

  public static createEmpty(overriddenObject: Partial<NormalWordParameter> = {}): NormalWordParameter {
    let search = overriddenObject.search ?? "";
    let mode = overriddenObject.mode ?? "both";
    let type = overriddenObject.type ?? "prefix";
    let order = overriddenObject.order ?? {mode: "unicode", direction: "ascending"};
    let ignoreOptions = overriddenObject.ignoreOptions ?? {case: false};
    let skeleton = new NormalWordParameter(search, mode, type, order, ignoreOptions);
    return skeleton;
  }

  public static deserializeEach(query: Record<string, unknown>): NormalWordParameter {
    let search = (typeof query.search === "string") ? query.search : undefined;
    let mode = (typeof query.mode === "string") ? WordModeUtil.cast(query.mode) : undefined;
    let type = (typeof query.type === "string") ? WordTypeUtil.cast(query.type) : undefined;
    let orderMode = (typeof query.orderMode === "string") ? WordOrderModeUtil.cast(query.orderMode) : undefined;
    let orderDirection = (typeof query.orderDirection === "string") ? WordOrderDirectionUtil.cast(query.orderDirection) : undefined;
    let order = (orderMode !== undefined && orderDirection !== undefined) ? {mode: orderMode, direction: orderDirection} : undefined;
    let ignoreOptions = (query.ignoreCase === "true") ? {case: true} : undefined;
    let parameter = NormalWordParameter.createEmpty({search, mode, type, order, ignoreOptions});
    return parameter;
  }

  public serialize(): string {
    let search = this.search;
    let mode = this.mode;
    let type = this.type;
    let orderMode = this.order.mode;
    let orderDirection = this.order.direction;
    let ignoreCase = this.ignoreOptions.case;
    let query = {search, mode, type, orderMode, orderDirection, ignoreCase};
    let queryString = queryParser.stringify(query);
    return queryString;
  }

}