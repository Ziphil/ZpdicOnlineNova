//

import {LinkedWordCreator} from "/server/external-alpha/creator/word/linked-word";
import type {
  EditableExample$In,
  Example$Out
} from "/server/external-alpha/schema";
import {
  EditableExample,
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

  export function enflesh(input: EditableExample$In): Omit<EditableExample, "number"> {
    const raw = {
      sentence: input.sentence,
      translation: input.translation,
      supplement: input.supplement,
      tags: input.tags,
      words: input.words.map(LinkedWordCreator.enflesh),
      offer: (input.offer !== null) ? input.offer : undefined
    } satisfies Omit<EditableExample, "number">;
    return raw;
  }

}