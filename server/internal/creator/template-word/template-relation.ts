//

import type {
  TemplateRelation as TemplateRelationSkeleton
} from "/server/internal/skeleton";
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

  export function enflesh(skeleton: TemplateRelationSkeleton): TemplateRelation {
    const raw = {
      titles: skeleton.titles
    } satisfies TemplateRelation;
    return raw;
  }

}
