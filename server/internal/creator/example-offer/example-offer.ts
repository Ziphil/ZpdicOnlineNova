//

import type {
  ExampleOffer as ExampleOfferSkeleton
} from "/client/skeleton";
import {
  ExampleOffer
} from "/server/model";


export namespace ExampleOfferCreator {

  export function skeletonize(raw: ExampleOffer): ExampleOfferSkeleton {
    const skeleton = {
      id: raw.id,
      catalog: raw.catalog,
      number: raw.number,
      translation: raw.translation,
      supplement: raw.supplement,
      author: raw.author,
      createdDate: raw.createdDate.toISOString()
    } satisfies ExampleOfferSkeleton;
    return skeleton;
  }

}