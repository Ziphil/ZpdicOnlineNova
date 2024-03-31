//

import type {
  DetailedWord as DetailedWordSkeleton,
  Word as WordSkeleton
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

  export function create(raw: Word): WordSkeleton {
    const id = raw.id;
    const number = raw.number;
    const name = raw.name;
    const pronunciation = raw.pronunciation;
    const equivalents = raw.equivalents.map(EquivalentCreator.create);
    const tags = raw.tags;
    const informations = raw.informations.map(InformationCreator.create);
    const variations = raw.variations.map(VariationCreator.create);
    const relations = raw.relations.map(RelationCreator.create);
    const createdDate = raw.createdDate?.toISOString() ?? undefined;
    const updatedDate = raw.updatedDate?.toISOString() ?? undefined;
    const skeleton = {id, number, name, pronunciation, equivalents, tags, informations, variations, relations, createdDate, updatedDate};
    return skeleton;
  }

  export async function createDetailed(raw: Word): Promise<DetailedWordSkeleton> {
    const base = create(raw);
    const examples = await ExampleModel.fetchByWord(raw).then((rawExamples) => rawExamples.map(ExampleCreator.create));
    const skeleton = {...base, examples};
    return skeleton;
  }

}
