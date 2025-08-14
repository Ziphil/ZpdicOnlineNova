//

import type {
  Relation as RelationSkeleton
} from "/server/internal/skeleton";
import {
  Relation
} from "/server/model";


export namespace RelationCreator {

  export function skeletonize(raw: Relation): RelationSkeleton {
    const skeleton = {
      titles: raw.titles,
      number: raw.number,
      spelling: raw.name
    } satisfies RelationSkeleton;
    return skeleton;
  }

  export function enflesh(input: RelationSkeleton): Relation {
    const raw = {
      titles: input.titles,
      number: input.number,
      name: input.spelling
    } satisfies Relation;
    return raw;
  }

}
