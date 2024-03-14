//

import type {
  Variation as VariationSkeleton
} from "/client/skeleton";
import {
  Variation
} from "/server/model";


export namespace VariationCreator {

  export function create(raw: Variation): VariationSkeleton {
    const title = raw.title;
    const name = raw.name;
    const skeleton = {title, name};
    return skeleton;
  }

}