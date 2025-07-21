//

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
      screenName: raw.screenName
    } satisfies UserSkeleton;
    return skeleton;
  }

  export function skeletonizeWithDetail(raw: User): UserSkeletonWithDetail {
    const base = skeletonize(raw);
    const skeleton = {
      ...base,
      email: raw.email,
      activated: raw.activated
    } satisfies UserSkeletonWithDetail;
    return skeleton;
  }

}