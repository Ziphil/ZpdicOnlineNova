//

import type {
  Information$In,
  Information$Out
} from "/server/external-alpha/schema";
import {
  Information
} from "/server/model";


export namespace InformationCreator {

  export function skeletonize(raw: Information): Information$Out {
    const skeleton = {
      title: raw.title,
      text: raw.text,
      hidden: raw.hidden ?? false
    } satisfies Information$Out;
    return skeleton;
  }

  export function enflesh(input: Information$In): Information {
    const raw = {
      title: input.title,
      text: input.text,
      hidden: input.hidden
    } satisfies Information;
    return raw;
  }

}
