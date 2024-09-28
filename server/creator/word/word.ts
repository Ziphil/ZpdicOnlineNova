//

import type {
  Word as WordSkeleton,
  WordWithExamples as WordSkeletonWithExamples
} from "/client/skeleton";
import {ExampleCreator} from "/server/creator/example/example";
import {EquivalentCreator} from "/server/creator/word/equivalent";
import {InformationCreator} from "/server/creator/word/information";
import {RelationCreator} from "/server/creator/word/relation";
import {VariationCreator} from "/server/creator/word/variation";
import {
  ExampleModel,
  Word
} from "/server/model";


export namespace WordCreator {

  export function skeletonize(raw: Word): WordSkeleton {
    const id = raw.id || raw["_id"];
    const number = raw.number;
    const name = raw.name;
    const pronunciation = raw.pronunciation;
    const equivalents = raw.equivalents.map(EquivalentCreator.skeletonize);
    const tags = raw.tags;
    const informations = raw.informations.map(InformationCreator.skeletonize);
    const variations = raw.variations.map(VariationCreator.skeletonize);
    const relations = raw.relations.map(RelationCreator.skeletonize);
    const updatedUser = raw.updatedUser ?? undefined;
    const createdDate = raw.createdDate?.toISOString() ?? undefined;
    const updatedDate = raw.updatedDate?.toISOString() ?? undefined;
    const skeleton = {id, number, name, pronunciation, equivalents, tags, informations, variations, relations, updatedUser, createdDate, updatedDate};
    return skeleton;
  }

  export async function skeletonizeWithExamples(raw: Word): Promise<WordSkeletonWithExamples> {
    const base = skeletonize(raw);
    const examples = await ExampleModel.fetchByWord(raw).then((rawExamples) => rawExamples.map(ExampleCreator.skeletonize));
    const skeleton = {...base, examples};
    return skeleton;
  }

}
