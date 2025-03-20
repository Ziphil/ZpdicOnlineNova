//

import type {
  Relation as RelationSkeleton
} from "/client/skeleton";
import {
  Relation
} from "/server/model";


export namespace RelationCreator {

  export function skeletonize(raw: Relation): RelationSkeleton {
    const skeleton = {
      titles: raw.titles,
      number: raw.number,
      name: raw.name
    } satisfies RelationSkeleton;
    return skeleton;
  }

}
