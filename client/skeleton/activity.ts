//

import {DateString} from "/client/skeleton/common";
import {LinkedDictionary} from "/client/skeleton/dictionary/linked-dictionary";


export interface ActivityWord {

  type: "word";
  operation: "add" | "change" | "discard";
  dictionary: LinkedDictionary;
  word: unknown;
  user: unknown;
  date: DateString;

}


export type Activity = ActivityWord;