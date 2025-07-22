//

import {DateString, ObjectId} from "/server/internal/skeleton/common";


export interface Notification {

  id: ObjectId;
  type: string;
  title: string;
  text: string;
  date: DateString;

}