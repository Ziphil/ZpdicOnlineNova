//

import {DateString, ObjectId} from "/client/skeleton/common";


export interface History {

  id: ObjectId;
  date: DateString;
  wordSize: number;

}