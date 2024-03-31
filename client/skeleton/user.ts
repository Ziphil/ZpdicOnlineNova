//

import {ObjectId} from "/client/skeleton/common";


export interface User {

  id: ObjectId;
  name: string;
  screenName: string;

}


export interface DetailedUser extends User {

  email: string;
  activated: boolean;

}