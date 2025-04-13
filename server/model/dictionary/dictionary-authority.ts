//

import {LiteralType, LiteralUtilType} from "/server/util/literal-type";


export const DICTIONARY_AUTHORITIES = ["own", "edit", "view"] as const;
export type DictionaryAuthority = LiteralType<typeof DICTIONARY_AUTHORITIES>;
export const DictionaryAuthorityUtil = LiteralUtilType.create(DICTIONARY_AUTHORITIES);

export type DictionaryAuthorityQuery = {authority: Exclude<DictionaryAuthority, "view">, exact?: true};