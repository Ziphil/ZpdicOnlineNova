//

import {LinkedExampleOffer$Out} from "/server/external-alpha/schema/example-offer/linked-example-offer";
import {LinkedWord$Out} from "/server/external-alpha/schema/word/linked-word";


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