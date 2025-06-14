//

import type {
  TemplateRelation as TemplateRelationSkeleton
} from "/client/skeleton";
import {
  TemplateRelation
} from "/server/model";


export namespace TemplateRelationCreator {

  export function skeletonize(raw: TemplateRelation): TemplateRelationSkeleton {
    const skeleton = {
      titles: raw.titles
    } satisfies TemplateRelationSkeleton;
    return skeleton;
  }

}
