//

import {WordCreator} from "/server/internal/creator/word/word";
import type {
  Suggestion as SuggestionSkeleton
} from "/server/internal/skeleton";
import {
  Suggestion
} from "/server/model";


export namespace SuggestionCreator {

  export function skeletonize(raw: Suggestion): SuggestionSkeleton {
    const skeleton = {
      title: raw.title,
      word: WordCreator.skeletonize(raw.word)
    } satisfies SuggestionSkeleton;
    return skeleton;
  }

}