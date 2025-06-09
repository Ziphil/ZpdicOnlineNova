//

import {Equivalent} from "/client/skeleton/word/equivalent";
import {Information} from "/client/skeleton/word/information";
import {Relation} from "/client/skeleton/word/relation";
import {Variation} from "/client/skeleton/word/variation";


export interface TemplateWord {

  title: string;
  name: string;
  pronunciation: string;
  equivalents: Array<Equivalent>;
  tags: Array<string>;
  informations: Array<Information>;
  variations: Array<Variation>;
  relations: Array<Relation>;

}


export namespace TemplateWord {

  export const EMPTY = {
    title: "",
    name: "",
    pronunciation: "",
    equivalents: [],
    tags: [],
    informations: [],
    variations: [],
    relations: []
  } satisfies TemplateWord;

}