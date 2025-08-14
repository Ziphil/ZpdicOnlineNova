//

import {EquivalentCreator} from "/server/external-alpha/creator/word/equivalent";
import {InformationCreator} from "/server/external-alpha/creator/word/information";
import {PhraseCreator} from "/server/external-alpha/creator/word/phrase";
import {RelationCreator} from "/server/external-alpha/creator/word/relation";
import {VariationCreator} from "/server/external-alpha/creator/word/variation";
import type {
  Section$In,
  Section$Out
} from "/server/external-alpha/schema";
import {
  Section
} from "/server/model";


export namespace SectionCreator {

  export function skeletonize(raw: Section): Section$Out {
    const skeleton = {
      equivalents: raw.equivalents.map(EquivalentCreator.skeletonize),
      informations: raw.informations.map(InformationCreator.skeletonize),
      phrases: raw.phrases?.map(PhraseCreator.skeletonize) ?? [],
      variations: raw.variations.map(VariationCreator.skeletonize),
      relations: raw.relations.map(RelationCreator.skeletonize)
    } satisfies Section$Out;
    return skeleton;
  }

  export function enflesh(input: Section$In): Section {
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
