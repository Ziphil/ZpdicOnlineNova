//

import {DateString, ObjectId} from "/server/internal/skeleton/common";
import {LiteralType, LiteralUtilType} from "/server/util/literal-type";


export interface User {

  id: ObjectId;
  name: string;
  screenName: string;
  socials: Array<UserSocial>;

}


export interface UserSocial {

  type: string;
  url: string;

}


export const USER_SOCIAL_TYPES = ["x", "bluesky", "misskey", "youtube", "note", "migdal", "discord", "website", "other"] as const;
export type UserSocialType = LiteralType<typeof USER_SOCIAL_TYPES>;
export const UserSocialTypeUtil = LiteralUtilType.create(USER_SOCIAL_TYPES);


export interface UserWithDetail extends User {

  email: string;
  activated: boolean;
  termsAgreement: TermsAgreement;

}


export interface TermsAgreement {

  version: number;
  date: DateString;

}


export interface ApiCredential {

  id: ObjectId;
  key?: string;
  createdDate?: DateString;
  lastUsedDate: DateString | null;

}