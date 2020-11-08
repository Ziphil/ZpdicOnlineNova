//

import * as queryParser from "query-string";
import {
  AdvancedWordParameter,
  NormalWordParameter
} from "/client/skeleton/dictionary";
import {
  Skeleton
} from "/client/skeleton/skeleton";
import {
  LiteralType,
  LiteralUtilType
} from "/server/util/literal-type";


export abstract class WordParameter extends Skeleton {

  public static deserialize(queryString: string): WordParameter {
    let query = queryParser.parse(queryString);
    if ("advanced" in query) {
      return AdvancedWordParameter.deserializeEach(query);
    } else {
      return NormalWordParameter.deserializeEach(query);
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