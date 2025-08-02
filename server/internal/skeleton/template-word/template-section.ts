//

import {TemplateEquivalent} from "/server/internal/skeleton/template-word/template-equivalent";
import {TemplatePhrase} from "/server/internal/skeleton/template-word/template-phrase";
import {TemplateRelation} from "/server/internal/skeleton/template-word/template-relation";
import {Information} from "/server/internal/skeleton/word/information";
import {Variation} from "/server/internal/skeleton/word/variation";


export interface TemplateSection {

  equivalents: Array<TemplateEquivalent>;
  informations: Array<Information>;
  phrases: Array<TemplatePhrase>;
  variations: Array<Variation>;
  relations: Array<TemplateRelation>;

}


export namespace TemplateSection {

  export const EMPTY = {
    equivalents: [],
    informations: [],
    phrases: [],
    variations: [],
    relations: []
  } satisfies TemplateSection;

}
