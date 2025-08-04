//

import type {
  Information$Out
} from "/server/external/schema";
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

}
