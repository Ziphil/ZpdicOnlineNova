//

import {EquivalentCreator} from "/server/internal/creator/word/equivalent";
import {InformationCreator} from "/server/internal/creator/word/information";
import {PhraseCreator} from "/server/internal/creator/word/phrase";
import {RelationCreator} from "/server/internal/creator/word/relation";
import {VariationCreator} from "/server/internal/creator/word/variation";
import type {
  Section as SectionSkeleton
} from "/server/internal/skeleton";
import {
  Section
} from "/server/model";


export namespace SectionCreator {

  export function skeletonize(raw: Section): SectionSkeleton {
    const skeleton = {
      equivalents: raw.equivalents.map(EquivalentCreator.skeletonize),
      informations: raw.informations.map(InformationCreator.skeletonize),
      phrases: raw.phrases?.map(PhraseCreator.skeletonize) ?? [],
      variations: raw.variations.map(VariationCreator.skeletonize),
      relations: raw.relations.map(RelationCreator.skeletonize)
    } satisfies SectionSkeleton;
    return skeleton;
  }

  export function enflesh(input: SectionSkeleton): Section {
    const raw = {
      equivalents: input.equivalents.map(EquivalentCreator.enflesh),
      informations: input.informations.map(InformationCreator.enflesh),
      phrases: input.phrases.map(PhraseCreator.enflesh),
      variations: input.variations.map(VariationCreator.enflesh),
      relations: input.relations.map(RelationCreator.enflesh)
    } satisfies Section;
    return raw;
  }

}
