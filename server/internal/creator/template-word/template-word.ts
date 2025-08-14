//

import {TemplateSectionCreator} from "/server/internal/creator/template-word/template-section";
import type {
  EditableTemplateWord as EditableTemplateWordSkeleton,
  TemplateWord as TemplateWordSkeleton
} from "/server/internal/skeleton";
import {
  EditableTemplateWord,
  TemplateWord
} from "/server/model";


export namespace TemplateWordCreator {

  export function skeletonize(raw: TemplateWord): TemplateWordSkeleton {
    const skeleton = {
      id: (raw as any)["_id"],
      title: raw.title,
      spelling: raw.name,
      pronunciation: raw.pronunciation ?? "",
      tags: raw.tags,
      sections: raw.sections.map(TemplateSectionCreator.skeletonize)
    } satisfies TemplateWordSkeleton;
    return skeleton;
  }

  export function enflesh(skeleton: EditableTemplateWordSkeleton): EditableTemplateWord {
    const raw = {
      id: skeleton.id,
      title: skeleton.title,
      name: skeleton.spelling,
      pronunciation: skeleton.pronunciation,
      tags: skeleton.tags,
      sections: skeleton.sections.map(TemplateSectionCreator.enflesh)
    } satisfies EditableTemplateWord;
    return raw;
  }

}
