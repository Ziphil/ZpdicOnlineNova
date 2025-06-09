//

import type {
  TemplateEquivalent as TemplateEquivalentSkeleton
} from "/client/skeleton";
import {
  TemplateEquivalent
} from "/server/model";


export namespace TemplateEquivalentCreator {

  export function skeletonize(raw: TemplateEquivalent): TemplateEquivalentSkeleton {
    const skeleton = {
      titles: raw.titles,
      nameString: raw.nameString
    } satisfies TemplateEquivalentSkeleton;
    return skeleton;
  }

}