//

import * as queryParser from "query-string";
import {
  AdvancedSearchParameter,
  NormalSearchParameter
} from "/server/skeleton/dictionary";
import {
  Skeleton
} from "/server/skeleton/skeleton";
import {
  LiteralType,
  LiteralUtilType
} from "/server/util/literal-type";


export abstract class SearchParameter extends Skeleton {

  public static deserialize(queryString: string): SearchParameter {
    let query = queryParser.parse(queryString);
    if ("advanced" in query) {
      return AdvancedSearchParameter.deserializeEach(query);
    } else {
      return NormalSearchParameter.deserializeEach(query);
    }
  }

  public abstract serialize(): string;

}


export const SEARCH_MODES = ["name", "equivalent", "both", "tag", "information", "content"] as const;
export type SearchMode = LiteralType<typeof SEARCH_MODES>;
export let SearchModeUtil = LiteralUtilType.create(SEARCH_MODES);

export const SEARCH_TYPES = ["exact", "prefix", "suffix", "part", "regular"] as const;
export type SearchType = LiteralType<typeof SEARCH_TYPES>;
export let SearchTypeUtil = LiteralUtilType.create(SEARCH_TYPES);