//

import type {
  ExampleOffer$Out
} from "/server/external/schema";
import {
  ExampleOffer
} from "/server/model";


export namespace ExampleOfferCreator {

  export function skeletonize(raw: ExampleOffer): ExampleOffer$Out {
    const skeleton = {
      id: raw.id,
      catalog: raw.catalog,
      number: raw.number,
      translation: raw.translation,
      supplement: raw.supplement ?? "",
      author: raw.author
    } satisfies ExampleOffer$Out;
    return skeleton;
  }

}