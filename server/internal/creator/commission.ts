//

import type {
  Proposal as CommissionSkeleton
} from "/client/skeleton";
import {
  Commission
} from "/server/model";


export namespace CommissionCreator {

  export function skeletonize(raw: Commission): CommissionSkeleton {
    const skeleton = {
      id: raw.id,
      name: raw.name,
      comment: raw.comment,
      createdDate: raw.createdDate.toISOString()
    } satisfies CommissionSkeleton;
    return skeleton;
  }

}