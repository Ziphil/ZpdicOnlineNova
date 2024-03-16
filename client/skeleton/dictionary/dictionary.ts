/* eslint-disable @typescript-eslint/no-namespace */

import {Akrantiain} from "akrantiain";
import {Zatlin} from "zatlin";
import {DictionarySettings} from "/client/skeleton/dictionary/dictionary-settings";
import {User} from "/client/skeleton/user";
import type {DictionaryAuthority} from "/server/model";


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


export interface EnhancedDictionary extends DetailedDictionary {

  akrantiain: Akrantiain | null;
  zatlin: Zatlin | null;

}


export namespace EnhancedDictionary {

  export function enhance(dictionary: DetailedDictionary): EnhancedDictionary {
    const akrantiain = (() => {
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
    })();
    const zatlin = (() => {
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
    })();
    const enhancedDictionary = {...dictionary, akrantiain, zatlin};
    return enhancedDictionary;
  }

}