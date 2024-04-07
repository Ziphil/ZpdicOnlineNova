//

import type {
  Variation as VariationSkeleton
} from "/client/skeleton";
import {
  Variation
} from "/server/model";


export namespace VariationCreator {

  export function skeletonize(raw: Variation): VariationSkeleton {
    const title = raw.title;
    const name = raw.name;
    const skeleton = {title, name};
    return skeleton;
  }

}