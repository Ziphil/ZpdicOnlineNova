//

import type {
  Equivalent as EquivalentSkeleton
} from "/server/external/schema";
import {
  Equivalent
} from "/server/model";


export namespace EquivalentCreator {

  export function skeletonize(raw: Equivalent): EquivalentSkeleton {
    const skeleton = {
      titles: raw.titles,
      names: raw.names,
      nameString: raw.nameString ?? raw.names.join(", "),
      ignoredPattern: raw.ignoredPattern ?? ""
    } satisfies EquivalentSkeleton;
    return skeleton;
  }

}