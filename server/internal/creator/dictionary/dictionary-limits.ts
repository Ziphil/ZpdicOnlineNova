//

import type {
  DictionaryLimits as DictionaryLimitsSkeleton
} from "/server/internal/skeleton";
import {
  DictionaryLimits
} from "/server/model";


export namespace DictionaryLimitsCreator {

  export function skeletonize(raw: DictionaryLimits): DictionaryLimitsSkeleton {
    const skeleton = raw.resolve() satisfies DictionaryLimitsSkeleton;
    return skeleton;
  }

}
