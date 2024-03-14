//

import type {
  Suggestion as SuggestionSkeleton
} from "/client/skeleton";
import {WordCreator} from "/server/creator/word/word";
import {
  Suggestion
} from "/server/model";


export namespace SuggestionCreator {

  export function create(raw: Suggestion): SuggestionSkeleton {
    const title = raw.title;
    const word = WordCreator.create(raw.word);
    const skeleton = {title, word};
    return skeleton;
  }

}