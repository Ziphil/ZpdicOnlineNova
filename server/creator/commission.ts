//

import type {
  Commission as CommissionSkeleton
} from "/client/skeleton";
import {
  Commission
} from "/server/model";


export namespace CommissionCreator {

  export function create(raw: Commission): CommissionSkeleton {
    const id = raw.id;
    const name = raw.name;
    const comment = raw.comment;
    const createdDate = raw.createdDate.toISOString();
    const skeleton = {id, name, comment, createdDate};
    return skeleton;
  }

}