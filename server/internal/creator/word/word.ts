//

import type {
  Word as WordSkeleton,
  WordWithExamples as WordSkeletonWithExamples
} from "/client/skeleton";
import {ExampleCreator} from "/server/internal/creator/example/example";
import {EquivalentCreator} from "/server/internal/creator/word/equivalent";
import {InformationCreator} from "/server/internal/creator/word/information";
import {PhraseCreator} from "/server/internal/creator/word/phrase";
import {RelationCreator} from "/server/internal/creator/word/relation";
import {VariationCreator} from "/server/internal/creator/word/variation";
import {
  ExampleModel,
  Word
} from "/server/model";


export namespace WordCreator {

  export function skeletonize(raw: Word): WordSkeleton {
    const skeleton = {
      id: raw.id || raw["_id"],
      number: raw.number,
      name: raw.name,
      pronunciation: raw.pronunciation ?? "",
      equivalents: raw.equivalents.map(EquivalentCreator.skeletonize),
      tags: raw.tags,
      informations: raw.informations.map(InformationCreator.skeletonize),
      phrases: raw.phrases?.map(PhraseCreator.skeletonize) ?? [],
      variations: raw.variations.map(VariationCreator.skeletonize),
      relations: raw.relations.map(RelationCreator.skeletonize),
      updatedUser: (raw.updatedUser !== undefined) ? {id: raw.updatedUser} : undefined,
      createdDate: raw.createdDate?.toISOString() ?? undefined,
      updatedDate: raw.updatedDate?.toISOString() ?? undefined
    } satisfies WordSkeleton;
    return skeleton;
  }

  export async function skeletonizeWithExamples(raw: Word): Promise<WordSkeletonWithExamples> {
    const base = skeletonize(raw);
    const examples = await ExampleModel.fetchByWord(raw).then((rawExamples) => rawExamples.map(ExampleCreator.skeletonize));
    const skeleton = {...base, examples};
    return skeleton;
  }

}
