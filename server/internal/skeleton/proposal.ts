//

import {DateString, ObjectId} from "/server/internal/skeleton/common";


export interface Proposal {

  id: ObjectId;
  term: string;
  comment: string;
  createdDate: DateString;

}