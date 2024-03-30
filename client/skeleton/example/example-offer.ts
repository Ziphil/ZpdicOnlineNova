/* eslint-disable @typescript-eslint/no-namespace */

import {ObjectId} from "/client/skeleton/common";


export interface ExampleOffer {

  id: ObjectId;
  path: string;
  translation: string;
  createdDate: string;

}