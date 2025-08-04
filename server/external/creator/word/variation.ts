//

import type {
  Variation$Out
} from "/server/external/schema";
import {
  Variation
} from "/server/model";


export namespace VariationCreator {

  export function skeletonize(raw: Variation): Variation$Out {
    const skeleton = {
      title: raw.title,
      name: raw.name,
      pronunciation: raw.pronunciation ?? ""
    } satisfies Variation$Out;
    return skeleton;
  }

}