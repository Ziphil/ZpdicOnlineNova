//

import * as queryParser from "query-string";
import {
  SearchMode,
  SearchModeUtil,
  SearchType,
  SearchTypeUtil
} from "/client/skeleton/dictionary";
import {
  SearchParameter
} from "/client/skeleton/dictionary/search-parameter/search-parameter";


export class NormalSearchParameter extends SearchParameter {

  public search!: string;
  public mode!: SearchMode;
  public type!: SearchType;

  public static createEmpty(overriddenObject: Partial<NormalSearchParameter> = {}): NormalSearchParameter {
    let search = overriddenObject.search ?? "";
    let mode = overriddenObject.mode ?? "both";
    let type = overriddenObject.type ?? "prefix";
    let skeleton = NormalSearchParameter.of({search, mode, type});
    return skeleton;
  }

  public static deserializeEach(query: Record<string, unknown>): NormalSearchParameter {
    let search = (typeof query.search === "string") ? query.search : undefined;
    let mode = (typeof query.mode === "string") ? SearchModeUtil.cast(query.mode) : undefined;
    let type = (typeof query.type === "string") ? SearchTypeUtil.cast(query.type) : undefined;
    let parameter = NormalSearchParameter.createEmpty({search, mode, type});
    return parameter;
  }

  public serialize(): string {
    let query = {search: this.search, mode: this.mode, type: this.type};
    let queryString = queryParser.stringify(query);
    return queryString;
  }

}