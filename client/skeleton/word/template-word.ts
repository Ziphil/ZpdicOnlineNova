//

import {ObjectId} from "/client/skeleton/common";
import {Information} from "/client/skeleton/word/information";
import {Phrase} from "/client/skeleton/word/phrase";
import {TemplateEquivalent} from "/client/skeleton/word/template-equivalent";
import {TemplateRelation} from "/client/skeleton/word/template-relation";
import {Variation} from "/client/skeleton/word/variation";


export interface EditableTemplateWord {

  id: ObjectId | null;
  title: string;
  name: string;
  pronunciation: string;
  equivalents: Array<TemplateEquivalent>;
  tags: Array<string>;
  informations: Array<Information>;
  phrases: Array<Phrase>;
  variations: Array<Variation>;
  relations: Array<TemplateRelation>;

}


export namespace EditableTemplateWord {

  export const EMPTY = {
    id: null,
    title: "",
    name: "",
    pronunciation: "",
    equivalents: [],
    tags: [],
    informations: [],
    phrases: [],
    variations: [],
    relations: []
  } satisfies EditableTemplateWord;

}


export interface TemplateWord {

  id: ObjectId;
  title: string;
  name: string;
  pronunciation: string;
  equivalents: Array<TemplateEquivalent>;
  tags: Array<string>;
  informations: Array<Information>;
  phrases: Array<Phrase>;
  variations: Array<Variation>;
  relations: Array<TemplateRelation>;

}