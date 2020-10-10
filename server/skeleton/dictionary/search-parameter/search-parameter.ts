//

import {
  LiteralType,
  LiteralUtilType
} from "/server/util/literal-type";


export const SEARCH_MODES = ["name", "equivalent", "both", "content"] as const;
export type SearchMode = LiteralType<typeof SEARCH_MODES>;
export let SearchModeUtil = LiteralUtilType.create(SEARCH_MODES);

export const SEARCH_TYPES = ["exact", "prefix", "suffix", "part", "regular"] as const;
export type SearchType = LiteralType<typeof SEARCH_TYPES>;
export let SearchTypeUtil = LiteralUtilType.create(SEARCH_TYPES);