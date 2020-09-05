//

import {
  Word,
  WordCreator
} from "/server/model/dictionary";
import {
  Suggestion as SuggestionSkeleton
} from "/server/skeleton/dictionary";


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
    let title = raw.title;
    let word = WordCreator.create(raw.word);
    let skeleton = SuggestionSkeleton.of({title, word});
    return skeleton;
  }

}