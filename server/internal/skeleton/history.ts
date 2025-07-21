//

import {DateString, ObjectId} from "/server/internal/skeleton/common";


export interface History {

  id: ObjectId;
  date: DateString;
  wordSize: number;

}