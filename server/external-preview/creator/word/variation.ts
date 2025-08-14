//

import type {
  Variation$Out
} from "/server/external-preview/schema";
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

  export function enflesh(input: Variation$Out): Variation {
    const raw = {
      title: input.title,
      name: input.name,
      pronunciation: input.pronunciation
    } satisfies Variation;
    return raw;
  }

}