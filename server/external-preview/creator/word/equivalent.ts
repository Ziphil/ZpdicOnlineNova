//

import type {
  Equivalent$Out
} from "/server/external-preview/schema";
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

  export function enflesh(input: Equivalent$Out): Equivalent {
    const raw = {
      titles: input.titles,
      names: input.names,
      nameString: input.nameString,
      ignoredPattern: input.ignoredPattern,
      hidden: input.hidden
    } satisfies Equivalent;
    return raw;
  }

}