//

import type {
  Variation as VariationSkeleton
} from "/server/internal/skeleton";
import {
  Variation
} from "/server/model";


export namespace VariationCreator {

  export function skeletonize(raw: Variation): VariationSkeleton {
    const skeleton = {
      title: raw.title,
      name: raw.name,
      pronunciation: raw.pronunciation ?? ""
    } satisfies VariationSkeleton;
    return skeleton;
  }

  export function enflesh(input: VariationSkeleton): Variation {
    const raw = {
      title: input.title,
      name: input.name,
      pronunciation: input.pronunciation
    } satisfies Variation;
    return raw;
  }

}