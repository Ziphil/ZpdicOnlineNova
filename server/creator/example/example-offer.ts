//

import type {
  ExampleOffer as ExampleOfferSkeleton
} from "/client/skeleton";
import {
  ExampleOffer
} from "/server/model";


export namespace ExampleOfferCreator {

  export function create(raw: ExampleOffer): ExampleOfferSkeleton {
    const id = raw.id;
    const path = raw.path;
    const translation = raw.translation;
    const createdDate = raw.createdDate.toISOString();
    const skeleton = {id, path, translation, createdDate};
    return skeleton;
  }

}