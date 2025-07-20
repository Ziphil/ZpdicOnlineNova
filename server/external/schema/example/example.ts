//

import {array, object, string} from "yup";
import {LINKED_EXAMPLE_OFFER, LinkedExampleOffer} from "/server/external/schema/example-offer/linked-example-offer";
import {LINKED_WORD, LinkedWord} from "/server/external/schema/word/linked-word";


export const EDITABLE_EXAMPLE = object({
  sentence: string().default(""),
  translation: string().default(""),
  supplement: string().default(""),
  tags: array().of(string().required()).default([]),
  words: array().of(LINKED_WORD.required()).default([]),
  offer: LINKED_EXAMPLE_OFFER.nullable().default(null)
});


export interface Example {

  id: string;
  number: number;
  sentence: string;
  translation: string;
  supplement: string;
  tags: Array<string>;
  words: Array<LinkedWord>;
  offer: LinkedExampleOffer | null;

}