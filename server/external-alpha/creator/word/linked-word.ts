//

import type {
  LinkedWord$In,
  LinkedWord$Out
} from "/server/external-alpha/schema";
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

  export function enflesh(input: LinkedWord$In): LinkedWord {
    const raw = {
      number: input.number
    } satisfies LinkedWord;
    return raw;
  }

}