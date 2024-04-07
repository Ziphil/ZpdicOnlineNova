//

import {ObjectId} from "/client/skeleton/common";


export interface User {

  id: ObjectId;
  name: string;
  screenName: string;

}


export interface UserWithDetail extends User {

  email: string;
  activated: boolean;

}