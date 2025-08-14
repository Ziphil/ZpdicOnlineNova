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
      termString: raw.nameString,
      hidden: raw.hidden ?? false
    } satisfies TemplateEquivalentSkeleton;
    return skeleton;
  }

  export function enflesh(skeleton: TemplateEquivalentSkeleton): TemplateEquivalent {
    const raw = {
      titles: skeleton.titles,
      nameString: skeleton.termString,
      hidden: skeleton.hidden
    } satisfies TemplateEquivalent;
    return raw;
  }

}