//

import {DictionarySettings} from "/client-new/skeleton/dictionary/dictionary-settings";
import {User} from "/client-new/skeleton/user";
import type {DictionaryAuthority} from "/server/model/dictionary";


export interface Dictionary {

  id: string;
  number: number;
  paramName?: string;
  name: string;
  status: string;
  secret: boolean;
  explanation?: string;
  settings: DictionarySettings;
  createdDate?: string;
  updatedDate?: string;

}


export interface DetailedDictionary extends Dictionary {

  user: User;

}


export interface UserDictionary extends DetailedDictionary {

  authorities: Array<DictionaryAuthority>;

}