//

import type {
  LinkedWord$Out
} from "/server/external/schema";
import {
  LinkedWord
} from "/server/model";


export namespace LinkedWordCreator {

  export function skeletonize(raw: LinkedWord): LinkedWord$Out {
    const skeleton = {
      number: raw.number
    } satisfies LinkedWord$Out;
    return skeleton;
  }

}