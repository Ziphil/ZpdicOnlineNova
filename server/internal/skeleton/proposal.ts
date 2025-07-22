//

import {DateString, ObjectId} from "/server/internal/skeleton/common";


export interface Proposal {

  id: ObjectId;
  name: string;
  comment?: string;
  createdDate: DateString;

}