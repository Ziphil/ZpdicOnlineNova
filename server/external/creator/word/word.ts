//

import {ExampleCreator} from "/server/external/creator/example/example";
import {EquivalentCreator} from "/server/external/creator/word/equivalent";
import {InformationCreator} from "/server/external/creator/word/information";
import {PhraseCreator} from "/server/external/creator/word/phrase";
import {RelationCreator} from "/server/external/creator/word/relation";
import {VariationCreator} from "/server/external/creator/word/variation";
import type {
  EditableWord$In,
  Word$Out,
  WordWithExamples$Out
} from "/server/external/schema";
import {
  EditableWord,
  ExampleModel,
  Word
} from "/server/model";


export namespace WordCreator {

  export function skeletonize(raw: Word): Word$Out {
    const skeleton = {
      id: raw.id || raw["_id"],
      number: raw.number,
      name: raw.name,
      pronunciation: raw.pronunciation ?? "",
      tags: raw.tags,
      equivalents: raw.sections[0]?.equivalents.map(EquivalentCreator.skeletonize) ?? [],
      informations: raw.sections[0]?.informations.map(InformationCreator.skeletonize) ?? [],
      phrases: raw.sections[0]?.phrases?.map(PhraseCreator.skeletonize) ?? [],
      variations: raw.sections[0]?.variations.map(VariationCreator.skeletonize) ?? [],
      relations: raw.sections[0]?.relations.map(RelationCreator.skeletonize) ?? []
    } satisfies Word$Out;
    return skeleton;
  }

  export async function skeletonizeWithExamples(raw: Word): Promise<WordWithExamples$Out> {
    const base = skeletonize(raw);
    const examples = await ExampleModel.fetchByWord(raw).then((rawExamples) => rawExamples.map(ExampleCreator.skeletonize));
    const skeleton = {...base, examples};
    return skeleton;
  }

  export function enflesh(skeleton: EditableWord$In): Omit<EditableWord, "number"> {
    const raw = {
      ...skeleton,
      sections: [{
        equivalents: skeleton.equivalents.map(EquivalentCreator.enflesh),
        informations: skeleton.informations.map(InformationCreator.enflesh),
        phrases: skeleton.phrases.map(PhraseCreator.enflesh),
        variations: skeleton.variations.map(VariationCreator.enflesh),
        relations: skeleton.relations.map(RelationCreator.enflesh)
      }]
    } satisfies Omit<EditableWord, "number">;
    return raw;
  }

}
