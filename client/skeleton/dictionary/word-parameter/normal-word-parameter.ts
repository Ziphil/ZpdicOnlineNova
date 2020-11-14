//

import * as queryParser from "query-string";
import {
  WordMode,
  WordModeUtil,
  WordType,
  WordTypeUtil
} from "/client/skeleton/dictionary";
import {
  WordParameter
} from "/client/skeleton/dictionary/word-parameter/word-parameter";


export class NormalWordParameter extends WordParameter {

  public search: string;
  public mode: WordMode;
  public type: WordType;

  private constructor(search: string, mode: WordMode, type: WordType) {
    super();
    this.search = search;
    this.mode = mode;
    this.type = type;
  }

  public static createEmpty(overriddenObject: Partial<NormalWordParameter> = {}): NormalWordParameter {
    let search = overriddenObject.search ?? "";
    let mode = overriddenObject.mode ?? "both";
    let type = overriddenObject.type ?? "prefix";
    let skeleton = new NormalWordParameter(search, mode, type);
    return skeleton;
  }

  public static deserializeEach(query: Record<string, unknown>): NormalWordParameter {
    let search = (typeof query.search === "string") ? query.search : undefined;
    let mode = (typeof query.mode === "string") ? WordModeUtil.cast(query.mode) : undefined;
    let type = (typeof query.type === "string") ? WordTypeUtil.cast(query.type) : undefined;
    let parameter = NormalWordParameter.createEmpty({search, mode, type});
    return parameter;
  }

  public serialize(): string {
    let query = {search: this.search, mode: this.mode, type: this.type};
    let queryString = queryParser.stringify(query);
    return queryString;
  }

}