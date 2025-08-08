//

import type {
  Proposal as ProposalSkeleton
} from "/server/internal/skeleton";
import {
  Proposal
} from "/server/model";


export namespace ProposalCreator {

  export function skeletonize(raw: Proposal): ProposalSkeleton {
    const skeleton = {
      id: raw.id,
      name: raw.name,
      comment: raw.comment ?? "",
      createdDate: raw.createdDate.toISOString()
    } satisfies ProposalSkeleton;
    return skeleton;
  }

}