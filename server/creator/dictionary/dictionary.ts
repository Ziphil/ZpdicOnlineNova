//

import {isDocument} from "@typegoose/typegoose";
import type {
  DetailedDictionary as DetailedDictionarySkeleton,
  Dictionary as DictionarySkeleton,
  UserDictionary as UserDictionarySkeleton,
  User as UserSkeleton
} from "/client/skeleton";
import {DictionarySettingsCreator} from "/server/creator/dictionary/dictionary-settings";
import {UserCreator} from "/server/creator/user/user";
import {
  Dictionary,
  User
} from "/server/model";


export namespace DictionaryCreator {

  export function create(raw: Dictionary): DictionarySkeleton {
    const id = raw.id;
    const number = raw.number;
    const paramName = raw.paramName;
    const name = raw.name;
    const status = raw.status;
    const secret = raw.secret;
    const explanation = raw.explanation;
    const settings = DictionarySettingsCreator.create(raw.settings);
    const createdDate = raw.createdDate?.toISOString() ?? undefined;
    const updatedDate = raw.updatedDate?.toISOString() ?? undefined;
    const skeleton = {id, number, paramName, name, status, secret, explanation, settings, createdDate, updatedDate};
    return skeleton;
  }

  export async function createDetailed(raw: Dictionary): Promise<DetailedDictionarySkeleton> {
    const base = create(raw);
    const userPromise = new Promise<UserSkeleton>(async (resolve, reject) => {
      try {
        await raw.populate("user");
        if (isDocument(raw.user)) {
          const user = UserCreator.create(raw.user);
          resolve(user);
        } else {
          reject();
        }
      } catch (error) {
        reject(error);
      }
    });
    const [user] = await Promise.all([userPromise]);
    const skeleton = {...base, user};
    return skeleton;
  }

  export async function createUser(raw: Dictionary, rawUser: User): Promise<UserDictionarySkeleton> {
    const basePromise = createDetailed(raw);
    const authoritiesPromise = raw.fetchAuthorities(rawUser);
    const [base, authorities] = await Promise.all([basePromise, authoritiesPromise]);
    const skeleton = {...base, authorities};
    return skeleton;
  }

}