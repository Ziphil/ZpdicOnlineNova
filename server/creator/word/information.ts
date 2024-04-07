//

import type {
  Information as InformationSkeleton
} from "/client/skeleton";
import {
  Information
} from "/server/model";


export namespace InformationCreator {

  export function skeletonize(raw: Information): InformationSkeleton {
    const title = raw.title;
    const text = raw.text;
    const skeleton = {title, text};
    return skeleton;
  }

}
