//

import {
  LiteralType,
  LiteralUtilType
} from "/server/util/literal-type";


export const DICTIONARY_AUTHORITIES = ["own", "edit"] as const;

export let DictionaryAuthorityUtil = LiteralUtilType.create(DICTIONARY_AUTHORITIES);
export type DictionaryAuthority = LiteralType<typeof DICTIONARY_AUTHORITIES>;