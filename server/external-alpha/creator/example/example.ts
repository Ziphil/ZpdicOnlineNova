//

import {LinkedWordCreator} from "/server/external-alpha/creator/word/linked-word";
import type {
  Example$Out
} from "/server/external-alpha/schema";
import {
  Example
} from "/server/model";


export namespace ExampleCreator {

  export function skeletonize(raw: Example): Example$Out {
    const skeleton = {
      id: raw.id || raw["_id"],
      number: raw.number,
      tags: raw.tags ?? [],
      words: raw.words.map(LinkedWordCreator.skeletonize),
      sentence: raw.sentence,
      translation: raw.translation,
      supplement: raw.supplement ?? "",
      offer: raw.offer ?? null
    } satisfies Example$Out;
    return skeleton;
  }

}