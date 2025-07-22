//

import {ObjectId} from "/server/internal/skeleton/common";


export interface ExampleOffer {

  id: ObjectId;
  catalog: string;
  number: number;
  translation: string;
  supplement?: string;
  author: string;
  createdDate: string;

}