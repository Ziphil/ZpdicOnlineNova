//

import {
  Akrantiain
} from "akrantiain";
import {
  Zatlin
} from "zatlin";
import {
  DictionarySettings
} from "/client/skeleton/dictionary";
import {
  Skeleton
} from "/client/skeleton/skeleton";
import {
  User
} from "/client/skeleton/user";
import {
  DictionaryAuthority
} from "/server/model/dictionary";


export class Dictionary extends Skeleton {

  public id!: string;
  public number!: number;
  public paramName?: string;
  public name!: string;
  public status!: string;
  public secret!: boolean;
  public explanation?: string;
  public settings!: DictionarySettings;
  public createdDate?: string;
  public updatedDate?: string;

  private akrantiain?: Akrantiain | null;
  private zatlin?: Zatlin | null;

  public getAkrantiain(): Akrantiain | null {
    if (this.akrantiain === undefined) {
      if (this.settings.akrantiainSource !== undefined && this.settings.akrantiainSource !== "") {
        try {
          let akrantiain = Akrantiain.load(this.settings.akrantiainSource);
          this.akrantiain = akrantiain;
        } catch (error) {
          this.akrantiain = null;
          console.error(error);
        }
      } else {
        this.akrantiain = null;
      }
    }
    return this.akrantiain;
  }

  public getZatlin(): Zatlin | null {
    if (this.zatlin === undefined) {
      if (this.settings.zatlinSource !== undefined && this.settings.zatlinSource !== "") {
        try {
          let zatlin = Zatlin.load(this.settings.zatlinSource);
          this.zatlin = zatlin;
        } catch (error) {
          this.zatlin = null;
          console.error(error);
        }
      } else {
        this.zatlin = null;
      }
    }
    return this.zatlin;
  }

}


export class DetailedDictionary extends Dictionary {

  public wordSize!: number;
  public user!: User;

}


export class UserDictionary extends DetailedDictionary {

  public authorities!: Array<DictionaryAuthority>;

}