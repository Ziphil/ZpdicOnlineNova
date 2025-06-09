//

import type {
  TemplateWord as TemplateWordSkeleton
} from "/client/skeleton";
import {EquivalentCreator} from "/server/internal/creator/word/equivalent";
import {InformationCreator} from "/server/internal/creator/word/information";
import {RelationCreator} from "/server/internal/creator/word/relation";
import {VariationCreator} from "/server/internal/creator/word/variation";
import {
  TemplateWord
} from "/server/model";


export namespace TemplateWordCreator {

  export function skeletonize(raw: TemplateWord): TemplateWordSkeleton {
    const skeleton = {
      title: raw.title,
      name: raw.name,
      pronunciation: raw.pronunciation ?? "",
      equivalents: raw.equivalents.map(EquivalentCreator.skeletonize),
      tags: raw.tags,
      informations: raw.informations.map(InformationCreator.skeletonize),
      variations: raw.variations.map(VariationCreator.skeletonize),
      relations: raw.relations.map(RelationCreator.skeletonize)
    } satisfies TemplateWordSkeleton;
    return skeleton;
  }

}
