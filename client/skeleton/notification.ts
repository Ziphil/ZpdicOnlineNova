//

import {ObjectId} from "/client/skeleton/common";


export interface Notification {

  id: ObjectId;
  type: string;
  date: string;
  title: string;
  text: string;

}