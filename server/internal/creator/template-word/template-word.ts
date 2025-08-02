//

import {TemplateSectionCreator} from "/server/internal/creator/template-word/template-section";
import type {
  TemplateWord as TemplateWordSkeleton
} from "/server/internal/skeleton";
import {
  TemplateWord
} from "/server/model";


export namespace TemplateWordCreator {

  export function skeletonize(raw: TemplateWord): TemplateWordSkeleton {
    const skeleton = {
      id: (raw as any)["_id"],
      title: raw.title,
      name: raw.name,
      pronunciation: raw.pronunciation ?? "",
      tags: raw.tags,
      sections: raw.sections.map(TemplateSectionCreator.skeletonize)
    } satisfies TemplateWordSkeleton;
    return skeleton;
  }

}
