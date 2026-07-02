//

import {DateString, ObjectId} from "/server/internal/skeleton/common";
import {User} from "/server/internal/skeleton/user";
import {LiteralType, LiteralUtilType} from "/server/util/literal-type";


export interface Member {

  id: ObjectId;
  user: User;
  authority: MemberAuthority;
  createdDate?: DateString;

}


export const MEMBER_AUTHORITIES = ["edit"] as const;
export type MemberAuthority = LiteralType<typeof MEMBER_AUTHORITIES>;
export const MemberAuthorityUtil = LiteralUtilType.create(MEMBER_AUTHORITIES);
