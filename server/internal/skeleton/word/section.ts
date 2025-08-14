//

import {Equivalent} from "/server/internal/skeleton/word/equivalent";
import {Information} from "/server/internal/skeleton/word/information";
import {Phrase} from "/server/internal/skeleton/word/phrase";
import {Relation} from "/server/internal/skeleton/word/relation";
import {Variation} from "/server/internal/skeleton/word/variation";


export interface Section {

  equivalents: Array<Equivalent>;
  informations: Array<Information>;
  phrases: Array<Phrase>;
  variations: Array<Variation>;
  relations: Array<Relation>;

}


export namespace Section {

  export const EMPTY = {
    equivalents: [],
    informations: [],
    phrases: [],
    variations: [],
    relations: []
  } satisfies Section;

}