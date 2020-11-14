//


export class User {

  public id!: string;
  public name!: string;
  public screenName!: string;

}


export class DetailedUser extends User {

  public email!: string;

}