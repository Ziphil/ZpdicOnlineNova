/* eslint-disable @typescript-eslint/no-namespace */

import {ObjectId} from "/client/skeleton/common";


export interface ExampleOffer {

  id: ObjectId;
  position: {name: string, index: number};
  translation: string;
  author: string;
  createdDate: string;

}