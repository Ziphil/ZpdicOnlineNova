//

import {
  Skeleton
} from "/server/skeleton/skeleton";


export class User extends Skeleton {

  public id!: string;
  public name!: string;
  public screenName!: string;

}


export class DetailedUser extends User {

  public email!: string;

}