//

import type {
  DetailedUser as DetailedUserSkeleton,
  User as UserSkeleton
} from "/client/skeleton";
import {
  User
} from "/server/model";


export namespace UserCreator {

  export function create(raw: User): UserSkeleton {
    const id = raw.id;
    const name = raw.name;
    const screenName = raw.screenName;
    const skeleton = {id, name, screenName};
    return skeleton;
  }

  export function createDetailed(raw: User): DetailedUserSkeleton {
    const base = create(raw);
    const email = raw.email;
    const activated = raw.activated;
    const skeleton = {...base, email, activated};
    return skeleton;
  }

}