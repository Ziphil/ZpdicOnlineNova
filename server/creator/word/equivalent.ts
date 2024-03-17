//

import type {
  Equivalent as EquivalentSkeleton
} from "/client/skeleton";
import {
  Equivalent
} from "/server/model";


export namespace EquivalentCreator {

  export function create(raw: Equivalent): EquivalentSkeleton {
    const titles = raw.titles;
    const names = raw.names;
    const skeleton = {titles, names};
    return skeleton;
  }

}