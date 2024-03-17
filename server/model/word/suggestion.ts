//

import {Word} from "/server/model/word/word";


export class Suggestion {

  public title: string;
  public word: Word;

  public constructor(title: string, word: Word) {
    this.title = title;
    this.word = word;
  }

}