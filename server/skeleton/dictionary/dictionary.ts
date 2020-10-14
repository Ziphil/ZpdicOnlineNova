//

import {
  DictionaryAuthority
} from "/server/model/dictionary";
import {
  DictionarySettings
} from "/server/skeleton/dictionary";
import {
  Skeleton
} from "/server/skeleton/skeleton";
import {
  User
} from "/server/skeleton/user";


export class Dictionary extends Skeleton {

  public id!: string;
  public number!: number;
  public paramName?: string;
  public name!: string;
  public status!: string;
  public secret!: boolean;
  public explanation?: string;
  public snoj?: string;
  public settings!: DictionarySettings;
  public createdDate?: string;
  public updatedDate?: string;

}


export class DetailedDictionary extends Dictionary {

  public wordSize!: number;
  public user!: User;

}


export class UserDictionary extends DetailedDictionary {

  public authorities!: Array<DictionaryAuthority>;

}