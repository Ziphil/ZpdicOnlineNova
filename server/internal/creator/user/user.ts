//

import {UserSocialCreator} from "/server/internal/creator/user/user-social";
import type {
  User as UserSkeleton,
  UserWithDetail as UserSkeletonWithDetail
} from "/server/internal/skeleton";
import {
  User
} from "/server/model";


export namespace UserCreator {

  export function skeletonize(raw: User): UserSkeleton {
    const skeleton = {
      id: raw.id,
      name: raw.name,
      screenName: raw.screenName,
      socials: (raw.socials ?? []).map(UserSocialCreator.skeletonize)
    } satisfies UserSkeleton;
    return skeleton;
  }

  export function skeletonizeWithDetail(raw: User): UserSkeletonWithDetail {
    const base = skeletonize(raw);
    const skeleton = {
      ...base,
      email: raw.email,
      activated: raw.activated,
      termsAgreement: (raw.termsAgreement !== undefined) ? {version: raw.termsAgreement.version, date: raw.termsAgreement.date.toISOString()} : {version: 0, date: new Date(0).toISOString()}
    } satisfies UserSkeletonWithDetail;
    return skeleton;
  }

}