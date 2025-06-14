//

import {isDocument} from "@typegoose/typegoose";
import type {
  Example as ExampleSkeleton,
  ExampleWithDictionary as ExampleSkeletonWithDictionary
} from "/client/skeleton";
import {DictionaryCreator} from "/server/internal/creator/dictionary/dictionary";
import {LinkedWordCreator} from "/server/internal/creator/word/linked-word";
import {
  Example
} from "/server/model";


export namespace ExampleCreator {

  export function skeletonize(raw: Example): ExampleSkeleton {
    const skeleton = {
      id: raw.id || raw["_id"],
      number: raw.number,
      tags: raw.tags ?? [],
      words: raw.words.map(LinkedWordCreator.skeletonize),
      sentence: raw.sentence,
      translation: raw.translation,
      supplement: raw.supplement,
      offer: raw.offer ?? null,
      updatedUser: (raw.updatedUser !== undefined) ? {id: raw.updatedUser} : undefined,
      createdDate: raw.createdDate?.toISOString() ?? undefined,
      updatedDate: raw.updatedDate?.toISOString() ?? undefined
    } satisfies ExampleSkeleton;
    return skeleton;
  }

  export async function skeletonizeWithDictionary(raw: Example): Promise<ExampleSkeletonWithDictionary> {
    const base = skeletonize(raw);
    const [dictionary] = await Promise.all([(async () => {
      if ("popluatedDictionary" in raw) {
        return DictionaryCreator.skeletonize(raw.popluatedDictionary as any);
      } else {
        await raw.populate("dictionary");
        if (isDocument(raw.dictionary)) {
          return DictionaryCreator.skeletonize(raw.dictionary);
        } else {
          throw new Error("cannot happen");
        }
      }
    })()]);
    const skeleton = {...base, dictionary};
    return skeleton;
  }

}