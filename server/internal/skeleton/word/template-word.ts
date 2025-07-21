//

import {ObjectId} from "/server/internal/skeleton/common";
import {Information} from "/server/internal/skeleton/word/information";
import {TemplateEquivalent} from "/server/internal/skeleton/word/template-equivalent";
import {TemplatePhrase} from "/server/internal/skeleton/word/template-phrase";
import {TemplateRelation} from "/server/internal/skeleton/word/template-relation";
import {Variation} from "/server/internal/skeleton/word/variation";


export interface EditableTemplateWord {

  id: ObjectId | null;
  title: string;
  name: string;
  pronunciation: string;
  equivalents: Array<TemplateEquivalent>;
  tags: Array<string>;
  informations: Array<Information>;
  phrases: Array<TemplatePhrase>;
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
  phrases: Array<TemplatePhrase>;
  variations: Array<Variation>;
  relations: Array<TemplateRelation>;

}