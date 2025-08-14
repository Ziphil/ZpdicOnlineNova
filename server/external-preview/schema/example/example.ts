//

import {InferType, array, object, string} from "yup";
import {LinkedExampleOffer$In, LinkedExampleOffer$Out} from "/server/external-preview/schema/example-offer/linked-example-offer";
import {LinkedWord$In, LinkedWord$Out} from "/server/external-preview/schema/word/linked-word";


export const EditableExample$In = object({

  sentence: string().default(""),
  translation: string().default(""),
  supplement: string().default(""),
  tags: array().of(string().required()).default([]),
  words: array().of(LinkedWord$In.required()).default([]),
  offer: LinkedExampleOffer$In.nullable().default(null)

});


export interface Example$Out {

  id: string;
  number: number;
  sentence: string;
  translation: string;
  supplement: string;
  tags: Array<string>;
  words: Array<LinkedWord$Out>;
  offer: LinkedExampleOffer$Out | null;

}


export type EditableExample$In = InferType<typeof EditableExample$In>;