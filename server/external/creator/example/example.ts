//

import {LinkedWordCreator} from "/server/external/creator/word/linked-word";
import type {
  Example as ExampleSkeleton
} from "/server/external/schema";
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
      supplement: raw.supplement ?? "",
      offer: raw.offer ?? null
    } satisfies ExampleSkeleton;
    return skeleton;
  }

}