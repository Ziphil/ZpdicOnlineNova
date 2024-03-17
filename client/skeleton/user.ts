//


export interface User {

  id: string;
  name: string;
  screenName: string;

}


export interface DetailedUser extends User {

  email: string;
  activated: boolean;

}