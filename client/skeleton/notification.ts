//

import {DateString, ObjectId} from "/client/skeleton/common";


export interface Notification {

  id: ObjectId;
  type: string;
  title: string;
  text: string;
  date: DateString;

}