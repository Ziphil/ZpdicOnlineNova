//

import {isDocument} from "@typegoose/typegoose";
import type {
  DetailedDictionary as DetailedDictionarySkeleton,
  Dictionary as DictionarySkeleton,
  UserDictionary as UserDictionarySkeleton
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
    const [user] = await Promise.all([(async () => {
      await raw.populate("user");
      if (isDocument(raw.user)) {
        return UserCreator.create(raw.user);
      } else {
        throw new Error("cannot happen");
      }
    })()]);
    const skeleton = {...base, user};
    return skeleton;
  }

  export async function createUser(raw: Dictionary, rawUser: User): Promise<UserDictionarySkeleton> {
    const [base, authorities] = await Promise.all([createDetailed(raw), raw.fetchAuthorities(rawUser)]);
    const skeleton = {...base, authorities};
    return skeleton;
  }

}