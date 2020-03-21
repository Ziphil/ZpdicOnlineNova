//

import {
  UserDocument
} from "/server/model/user";
import {
  Skeleton
} from "/server/skeleton/skeleton";


export class UserSkeleton extends Skeleton {

  public id!: string;
  public name!: string;
  public email!: string;

  public static from(raw: UserDocument): UserSkeleton {
    let id = raw.id;
    let name = raw.name;
    let email = raw.email;
    let skeleton = UserSkeleton.of({id, name, email});
    return skeleton;
  }

}