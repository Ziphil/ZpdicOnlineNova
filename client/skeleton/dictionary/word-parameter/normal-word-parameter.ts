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
  public enableSuggestions: boolean;

  private constructor(text: string, mode: WordMode, type: WordType, order: WordOrder, ignoreOptions: WordIgnoreOptions, enableSuggestions: boolean) {
    super();
    this.text = text;
    this.mode = mode;
    this.type = type;
    this.order = order;
    this.ignoreOptions = ignoreOptions;
    this.enableSuggestions = enableSuggestions;
  }

  public static createEmpty(overrides: Partial<NormalWordParameter> = {}): NormalWordParameter {
    const text = overrides.text ?? "";
    const mode = overrides.mode ?? "both";
    const type = overrides.type ?? "prefix";
    const order = overrides.order ?? {mode: "unicode", direction: "ascending"};
    const ignoreOptions = overrides.ignoreOptions ?? {case: false};
    const enableSuggestions = overrides.enableSuggestions ?? false;
    const skeleton = new NormalWordParameter(text, mode, type, order, ignoreOptions, enableSuggestions);
    return skeleton;
  }

  public static deserializeEach(search: Record<string, unknown>): NormalWordParameter {
    const text = (typeof search.text === "string") ? search.text : (typeof search.search === "string") ? search.search : undefined;
    const mode = (typeof search.mode === "string") ? WordModeUtil.cast(search.mode) : undefined;
    const type = (typeof search.type === "string") ? WordTypeUtil.cast(search.type) : undefined;
    const orderMode = (typeof search.orderMode === "string") ? WordOrderModeUtil.cast(search.orderMode) : undefined;
    const orderDirection = (typeof search.orderDirection === "string") ? WordOrderDirectionUtil.cast(search.orderDirection) : undefined;
    const order = (orderMode !== undefined && orderDirection !== undefined) ? {mode: orderMode, direction: orderDirection} : undefined;
    const ignoreOptions = (search.ignoreCase === "true") ? {case: true} : undefined;
    const enableSuggestions = search.enableSuggestions === "true";
    const parameter = NormalWordParameter.createEmpty({text, mode, type, order, ignoreOptions, enableSuggestions});
    return parameter;
  }

  public serialize(): Record<string, unknown> {
    const text = this.text;
    const mode = this.mode;
    const type = this.type;
    const orderMode = this.order.mode;
    const orderDirection = this.order.direction;
    const ignoreCase = this.ignoreOptions.case;
    const enableSuggestions = this.enableSuggestions;
    const search = {text, mode, type, orderMode, orderDirection, ignoreCase, enableSuggestions};
    return search;
  }

}