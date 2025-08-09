//

import type {
  Information as InformationSkeleton
} from "/server/internal/skeleton";
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

  export function enflesh(input: InformationSkeleton): Information {
    const raw = {
      title: input.title,
      text: input.text,
      hidden: input.hidden
    } satisfies Information;
    return raw;
  }

}
