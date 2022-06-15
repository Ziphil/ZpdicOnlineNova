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
  User
} from "/client/skeleton/user";
import {
  DictionaryAuthority
} from "/server/model/dictionary";


export class Dictionary {

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

}


export class DetailedDictionary extends Dictionary {

  public wordSize!: number;
  public user!: User;

}


export class UserDictionary extends DetailedDictionary {

  public authorities!: Array<DictionaryAuthority>;

}


export class EnhancedDictionary extends DetailedDictionary {

  private akrantiain?: Akrantiain | null;
  private zatlin?: Zatlin | null;

  public static enhance(object: DetailedDictionary): EnhancedDictionary {
    return Object.assign(Object.create(EnhancedDictionary.prototype), object);
  }

  public getAkrantiain(): Akrantiain | null {
    if (this.akrantiain === undefined) {
      if (this.settings.akrantiainSource !== undefined && this.settings.akrantiainSource !== "") {
        try {
          const akrantiain = Akrantiain.load(this.settings.akrantiainSource);
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
          const zatlin = Zatlin.load(this.settings.zatlinSource);
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