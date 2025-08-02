//

import {TemplateEquivalentCreator} from "/server/internal/creator/template-word/template-equivalent";
import {TemplatePhraseCreator} from "/server/internal/creator/template-word/template-phrase";
import {TemplateRelationCreator} from "/server/internal/creator/template-word/template-relation";
import {InformationCreator} from "/server/internal/creator/word/information";
import {VariationCreator} from "/server/internal/creator/word/variation";
import type {
  TemplateSection as TemplateSectionSkeleton
} from "/server/internal/skeleton";
import {
  TemplateSection
} from "/server/model";


export namespace TemplateSectionCreator {

  export function skeletonize(raw: TemplateSection): TemplateSectionSkeleton {
    const skeleton = {
      equivalents: raw.equivalents.map(TemplateEquivalentCreator.skeletonize),
      informations: raw.informations.map(InformationCreator.skeletonize),
      phrases: raw.phrases?.map(TemplatePhraseCreator.skeletonize) ?? [],
      variations: raw.variations.map(VariationCreator.skeletonize),
      relations: raw.relations.map(TemplateRelationCreator.skeletonize)
    } satisfies TemplateSectionSkeleton;
    return skeleton;
  }

}
