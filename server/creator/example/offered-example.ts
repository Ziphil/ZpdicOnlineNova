//

import type {
  OfferedExample as OfferedExampleSkeleton
} from "/client/skeleton";
import {
  OfferedExample
} from "/server/model";


export namespace OfferedExampleCreator {

  export function create(raw: OfferedExample): OfferedExampleSkeleton {
    const id = raw.id;
    const path = raw.path;
    const translation = raw.translation;
    const createdDate = raw.createdDate.toISOString();
    const skeleton = {id, path, translation, createdDate};
    return skeleton;
  }

}