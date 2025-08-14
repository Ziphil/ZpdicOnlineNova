//

import {InferType, array, object} from "yup";
import {Equivalent$In, Equivalent$Out} from "/server/external-alpha/schema/word/equivalent";
import {Information$In, Information$Out} from "/server/external-alpha/schema/word/information";
import {Phrase$In, Phrase$Out} from "/server/external-alpha/schema/word/phrase";
import {Relation$In, Relation$Out} from "/server/external-alpha/schema/word/relation";
import {Variation$In, Variation$Out} from "/server/external-alpha/schema/word/variation";


export const Section$In = object({

  equivalents: array().of(Equivalent$In.defined()).default([]),
  informations: array().of(Information$In.defined()).default([]),
  phrases: array().of(Phrase$In.defined()).default([]),
  variations: array().of(Variation$In.defined()).default([]),
  relations: array().of(Relation$In.defined()).default([])

});


export interface Section$Out {

  equivalents: Array<Equivalent$Out>;
  informations: Array<Information$Out>;
  phrases: Array<Phrase$Out>;
  variations: Array<Variation$Out>;
  relations: Array<Relation$Out>;

}


export type Section$In = InferType<typeof Section$In>;