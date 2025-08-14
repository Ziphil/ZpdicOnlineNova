//

import type {
  Variation$In,
  Variation$Out
} from "/server/external-alpha/schema";
import {
  Variation
} from "/server/model";


export namespace VariationCreator {

  export function skeletonize(raw: Variation): Variation$Out {
    const skeleton = {
      title: raw.title,
      spelling: raw.name,
      pronunciation: raw.pronunciation ?? ""
    } satisfies Variation$Out;
    return skeleton;
  }

  export function enflesh(input: Variation$In): Variation {
    const raw = {
      title: input.title,
      name: input.spelling,
      pronunciation: input.pronunciation
    } satisfies Variation;
    return raw;
  }

}