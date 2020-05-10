//

import {
  LiteralType,
  LiteralUtilType
} from "/server/util/literal-type";


export class NormalSearchParameter {

  public search: string;
  public mode: SearchMode;
  public type: SearchType;

  public constructor(search: string, mode: SearchMode, type: SearchType) {
    this.search = search;
    this.mode = mode;
    this.type = type;
  }

}


export const SEARCH_MODES = ["name", "equivalent", "both", "content"] as const;
export const SEARCH_TYPES = ["exact", "prefix", "suffix", "part", "regular"] as const;

export let SearchModeUtil = LiteralUtilType.create(SEARCH_MODES);
export let SearchTypeUtil = LiteralUtilType.create(SEARCH_TYPES);
export type SearchMode = LiteralType<typeof SEARCH_MODES>;
export type SearchType = LiteralType<typeof SEARCH_TYPES>;