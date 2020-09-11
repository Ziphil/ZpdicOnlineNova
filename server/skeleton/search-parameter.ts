//

import {
  Skeleton
} from "/server/skeleton/skeleton";
import {
  LiteralType,
  LiteralUtilType
} from "/server/util/literal-type";


export class NormalSearchParameter extends Skeleton {

  public search!: string;
  public mode!: SearchMode;
  public type!: SearchType;

}


export const SEARCH_MODES = ["name", "equivalent", "both", "content"] as const;
export const SEARCH_TYPES = ["exact", "prefix", "suffix", "part", "regular"] as const;

export let SearchModeUtil = LiteralUtilType.create(SEARCH_MODES);
export let SearchTypeUtil = LiteralUtilType.create(SEARCH_TYPES);
export type SearchMode = LiteralType<typeof SEARCH_MODES>;
export type SearchType = LiteralType<typeof SEARCH_TYPES>;