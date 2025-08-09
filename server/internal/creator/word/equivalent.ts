//

import type {
  Equivalent as EquivalentSkeleton
} from "/server/internal/skeleton";
import {
  Equivalent
} from "/server/model";


export namespace EquivalentCreator {

  export function skeletonize(raw: Equivalent): EquivalentSkeleton {
    const skeleton = {
      titles: raw.titles,
      names: raw.names,
      nameString: raw.nameString ?? raw.names.join(", "),
      ignoredPattern: raw.ignoredPattern,
      hidden: raw.hidden ?? false
    } satisfies EquivalentSkeleton;
    return skeleton;
  }

  export function enflesh(input: EquivalentSkeleton): Equivalent {
    const raw = {
      titles: input.titles,
      names: input.names,
      nameString: input.nameString,
      ignoredPattern: input.ignoredPattern,
      hidden: input.hidden
    } satisfies Equivalent;
    return raw;
  }

}