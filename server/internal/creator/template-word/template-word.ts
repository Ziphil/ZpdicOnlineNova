//

import {TemplateEquivalentCreator} from "/server/internal/creator/template-word/template-equivalent";
import {TemplatePhraseCreator} from "/server/internal/creator/template-word/template-phrase";
import {TemplateRelationCreator} from "/server/internal/creator/template-word/template-relation";
import {InformationCreator} from "/server/internal/creator/word/information";
import {VariationCreator} from "/server/internal/creator/word/variation";
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
      equivalents: raw.equivalents.map(TemplateEquivalentCreator.skeletonize),
      tags: raw.tags,
      informations: raw.informations.map(InformationCreator.skeletonize),
      phrases: raw.phrases?.map(TemplatePhraseCreator.skeletonize) ?? [],
      variations: raw.variations.map(VariationCreator.skeletonize),
      relations: raw.relations.map(TemplateRelationCreator.skeletonize)
    } satisfies TemplateWordSkeleton;
    return skeleton;
  }

}
