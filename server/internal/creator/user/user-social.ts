//

import type {
  UserSocial as UserSocialSkeleton
} from "/server/internal/skeleton";
import {
  UserSocial
} from "/server/model";


export namespace UserSocialCreator {

  export function skeletonize(raw: UserSocial): UserSocialSkeleton {
    const skeleton = {
      type: raw.type,
      url: raw.url
    } satisfies UserSocialSkeleton;
    return skeleton;
  }

  export function enflesh(input: UserSocialSkeleton): UserSocial {
    const raw = {
      type: input.type,
      url: input.url
    } satisfies UserSocial;
    return raw;
  }

}
