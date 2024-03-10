//

import type {
  Suggestion as SuggestionSkeleton
} from "/client/skeleton";
import {
  Word,
  WordCreator
} from "/server/model/dictionary";


export class Suggestion {

  public title: string;
  public word: Word;

  public constructor(title: string, word: Word) {
    this.title = title;
    this.word = word;
  }

}


export class SuggestionCreator {

  public static create(raw: Suggestion): SuggestionSkeleton {
    const title = raw.title;
    const word = WordCreator.create(raw.word);
    const skeleton = {title, word};
    return skeleton;
  }

}