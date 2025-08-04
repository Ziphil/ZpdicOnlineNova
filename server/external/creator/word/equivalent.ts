//

import type {
  Equivalent$Out
} from "/server/external/schema";
import {
  Equivalent
} from "/server/model";


export namespace EquivalentCreator {

  export function skeletonize(raw: Equivalent): Equivalent$Out {
    const skeleton = {
      titles: raw.titles,
      names: raw.names,
      nameString: raw.nameString ?? raw.names.join(", "),
      ignoredPattern: raw.ignoredPattern ?? "",
      hidden: raw.hidden ?? false
    } satisfies Equivalent$Out;
    return skeleton;
  }

}