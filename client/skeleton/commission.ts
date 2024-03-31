//

import {ObjectId} from "/client/skeleton/common";


export interface Commission {

  id: ObjectId;
  name: string;
  comment?: string;
  createdDate: string;

}