//

import type {
  Information as InformationSkeleton
} from "/server/external/schema";
import {
  Information
} from "/server/model";


export namespace InformationCreator {

  export function skeletonize(raw: Information): InformationSkeleton {
    const skeleton = {
      title: raw.title,
      text: raw.text,
      hidden: raw.hidden ?? false
    } satisfies InformationSkeleton;
    return skeleton;
  }

}
