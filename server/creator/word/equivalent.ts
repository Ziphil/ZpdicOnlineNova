//

import type {
  Equivalent as EquivalentSkeleton
} from "/client/skeleton";
import {
  Equivalent
} from "/server/model";


export namespace EquivalentCreator {

  export function skeletonize(raw: Equivalent): EquivalentSkeleton {
    const titles = raw.titles;
    const names = raw.names;
    const nameString = raw.nameString ?? names.join(", ");
    const ignoredPattern = raw.ignoredPattern;
    const skeleton = {titles, names, nameString, ignoredPattern};
    return skeleton;
  }

}