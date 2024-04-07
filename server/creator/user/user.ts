//

import type {
  User as UserSkeleton,
  UserWithDetail as UserSkeletonWithDetail
} from "/client/skeleton";
import {
  User
} from "/server/model";


export namespace UserCreator {

  export function skeletonize(raw: User): UserSkeleton {
    const id = raw.id;
    const name = raw.name;
    const screenName = raw.screenName;
    const skeleton = {id, name, screenName};
    return skeleton;
  }

  export function skeletonizeWithDetail(raw: User): UserSkeletonWithDetail {
    const base = skeletonize(raw);
    const email = raw.email;
    const activated = raw.activated;
    const skeleton = {...base, email, activated};
    return skeleton;
  }

}