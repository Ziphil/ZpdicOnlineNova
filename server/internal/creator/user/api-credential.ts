//

import type {
  ApiCredential as ApiCredentialSkeleton
} from "/server/internal/skeleton";
import {
  ApiCredential
} from "/server/model";


export namespace ApiCredentialCreator {

  export function skeletonize(raw: ApiCredential): ApiCredentialSkeleton {
    const skeleton = {
      id: raw.id,
      createdDate: raw.createdDate?.toISOString(),
      lastUsedDate: raw.lastUsedDate?.toISOString() ?? null
    } satisfies ApiCredentialSkeleton;
    return skeleton;
  }

  export function skeletonizeWithKey(raw: ApiCredential): ApiCredentialSkeleton {
    const base = skeletonize(raw);
    const skeleton = {
      ...base,
      key: raw.key
    } satisfies ApiCredentialSkeleton;
    return skeleton;
  }

}
