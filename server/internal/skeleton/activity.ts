//

import {DateString} from "/server/internal/skeleton/common";
import {LinkedDictionary} from "/server/internal/skeleton/dictionary/linked-dictionary";


export interface ActivityWord {

  type: "word";
  operation: "add" | "change" | "discard";
  dictionary: LinkedDictionary;
  word: unknown;
  user: unknown;
  date: DateString;

}


export type Activity = ActivityWord;