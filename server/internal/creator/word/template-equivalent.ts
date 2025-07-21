//

import type {
  TemplateEquivalent as TemplateEquivalentSkeleton
} from "/server/internal/skeleton";
import {
  TemplateEquivalent
} from "/server/model";


export namespace TemplateEquivalentCreator {

  export function skeletonize(raw: TemplateEquivalent): TemplateEquivalentSkeleton {
    const skeleton = {
      titles: raw.titles,
      nameString: raw.nameString,
      hidden: raw.hidden ?? false
    } satisfies TemplateEquivalentSkeleton;
    return skeleton;
  }

}