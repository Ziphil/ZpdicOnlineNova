//

import {isDocument} from "@typegoose/typegoose";
import type {
  Dictionary as DictionarySkeleton,
  DictionaryWithAuthorities as DictionarySkeletonWithAuthorities,
  DictionaryWithUser as DictionarySkeletonWithUser
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

  export async function createWithUser(raw: Dictionary): Promise<DictionarySkeletonWithUser> {
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

  export async function createWithAuthorities(raw: Dictionary, rawUser: User): Promise<DictionarySkeletonWithAuthorities> {
    const [base, authorities] = await Promise.all([createWithUser(raw), raw.fetchAuthorities(rawUser)]);
    const skeleton = {...base, authorities};
    return skeleton;
  }

}