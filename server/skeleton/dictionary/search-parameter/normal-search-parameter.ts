//

import * as queryParser from "query-string";
import {
  SearchMode,
  SearchModeUtil,
  SearchType,
  SearchTypeUtil
} from "/server/skeleton/dictionary";
import {
  SearchParameter
} from "/server/skeleton/dictionary/search-parameter/search-parameter";


export class NormalSearchParameter extends SearchParameter {

  public search!: string;
  public mode!: SearchMode;
  public type!: SearchType;

  public static deserialize(queryString: string): NormalSearchParameter {
    let query = queryParser.parse(queryString);
    let search = "";
    let mode = "both" as SearchMode;
    let type = "prefix" as SearchType;
    if (typeof query.search === "string") {
      search = query.search;
    }
    if (typeof query.mode === "string") {
      mode = SearchModeUtil.cast(query.mode);
    }
    if (typeof query.type === "string") {
      type = SearchTypeUtil.cast(query.type);
    }
    let parameter = NormalSearchParameter.of({search, mode, type});
    return parameter;
  }

  public serialize(): string {
    let query = {search: this.search, mode: this.mode, type: this.type};
    let queryString = queryParser.stringify(query);
    return queryString;
  }

}