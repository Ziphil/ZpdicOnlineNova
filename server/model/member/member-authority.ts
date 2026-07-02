//

import {LiteralType, LiteralUtilType} from "/server/util/literal-type";


export const MEMBER_AUTHORITIES = ["edit"] as const;
export type MemberAuthority = LiteralType<typeof MEMBER_AUTHORITIES>;
export const MemberAuthorityUtil = LiteralUtilType.create(MEMBER_AUTHORITIES);
