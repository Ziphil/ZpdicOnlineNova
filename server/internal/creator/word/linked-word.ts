//

import type {
  LinkedWord as LinkedWordSkeleton
} from "/server/internal/skeleton";
import {
  LinkedWord
} from "/server/model";


export namespace LinkedWordCreator {

  export function skeletonize(raw: LinkedWord): LinkedWordSkeleton {
    const skeleton = {
      number: raw.number
    } satisfies LinkedWordSkeleton;
    return skeleton;
  }

}