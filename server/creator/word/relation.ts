//

import type {
  Relation as RelationSkeleton
} from "/client/skeleton";
import {
  Relation
} from "/server/model";


export namespace RelationCreator {

  export function skeletonize(raw: Relation): RelationSkeleton {
    const titles = raw.titles;
    const number = raw.number;
    const name = raw.name;
    const skeleton = {titles, number, name};
    return skeleton;
  }

}
