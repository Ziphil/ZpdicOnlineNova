//

import {
  LiteralType,
  LiteralUtilType
} from "/server/util/literal-type";


export const DICTIONARY_AUTHORITIES = ["own", "edit"] as const;
export type DictionaryAuthority = LiteralType<typeof DICTIONARY_AUTHORITIES>;
export const DictionaryAuthorityUtil = LiteralUtilType.create(DICTIONARY_AUTHORITIES);

export const DICTIONARY_FULL_AUTHORITIES = ["own", "edit", "editOnly"] as const;
export type DictionaryFullAuthority = LiteralType<typeof DICTIONARY_FULL_AUTHORITIES>;
export const DictionaryFullAuthorityUtil = LiteralUtilType.create(DICTIONARY_FULL_AUTHORITIES);