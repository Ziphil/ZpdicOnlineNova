//

import {Akrantiain} from "akrantiain";
import {Zatlin} from "zatlin";
import {ObjectId} from "/client/skeleton/common";
import {DictionarySettings} from "/client/skeleton/dictionary/dictionary-settings";
import {User} from "/client/skeleton/user";
import type {DictionaryAuthority} from "/server/model";
import {LiteralType, LiteralUtilType} from "/server/util/literal-type";


export interface Dictionary {

  id: ObjectId;
  number: number;
  paramName?: string;
  name: string;
  status: string;
  visibility: DictionaryVisibility;
  explanation?: string;
  settings: DictionarySettings;
  createdDate?: string;
  updatedDate?: string;

}


export interface DictionaryWithUser extends Dictionary {

  user: User;

}


export interface DictionaryWithAuthorities extends Dictionary {

  user: User;
  authorities: Array<DictionaryAuthority>;

}


export interface DictionaryWithExecutors extends Dictionary {

  user: User;
  akrantiain: Akrantiain | null;
  zatlin: Zatlin | null;

}


export namespace Dictionary {

  export function getAkrantiain(dictionary: DictionaryWithUser): Akrantiain | null {
    if (dictionary.settings.akrantiainSource !== undefined && dictionary.settings.akrantiainSource !== "") {
      try {
        const akrantiain = Akrantiain.load(dictionary.settings.akrantiainSource);
        return akrantiain;
      } catch (error) {
        console.error(error);
        return null;
      }
    } else {
      return null;
    }
  }

  export function getZatlin(dictionary: DictionaryWithUser): Zatlin | null {
    if (dictionary.settings.zatlinSource !== undefined && dictionary.settings.zatlinSource !== "") {
      try {
        const zatlin = Zatlin.load(dictionary.settings.zatlinSource);
        return zatlin;
      } catch (error) {
        console.error(error);
        return null;
      }
    } else {
      return null;
    }
  }

}


export const DICTIONARY_VISIBILITIES = ["public", "unlisted", "private"] as const;
export type DictionaryVisibility = LiteralType<typeof DICTIONARY_VISIBILITIES>;
export const DictionaryVisibilityUtil = LiteralUtilType.create(DICTIONARY_VISIBILITIES);