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


const SEARCH_MODE_KEYS = ["name", "equivalent", "both", "content"] as const;
const SEARCH_TYPE_KEYS = ["exact", "prefix", "suffix", "part", "regular"] as const;

export let SearchModeUtil = LiteralUtilType.create(SEARCH_MODE_KEYS);
export type SearchMode = LiteralType<typeof SEARCH_MODE_KEYS>;

export let SearchTypeUtil = LiteralUtilType.create(SEARCH_TYPE_KEYS);
export type SearchType = LiteralType<typeof SEARCH_TYPE_KEYS>;