//

import {ObjectId} from "/client/skeleton/common";


export interface ExampleOffer {

  id: ObjectId;
  catalog: string;
  number: number;
  translation: string;
  supplement?: string;
  author: string;
  createdDate: string;

}