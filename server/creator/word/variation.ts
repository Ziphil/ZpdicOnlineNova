//

import type {
  Variation as VariationSkeleton
} from "/client/skeleton";
import {
  Variation
} from "/server/model";


export namespace VariationCreator {

  export function skeletonize(raw: Variation): VariationSkeleton {
    const skeleton = {
      title: raw.title,
      name: raw.name
    } satisfies VariationSkeleton;
    return skeleton;
  }

}