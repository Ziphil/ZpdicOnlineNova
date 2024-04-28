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

  export function skeletonize(raw: Dictionary): DictionarySkeleton {
    const id = raw.id || raw["_id"];
    const number = raw.number;
    const paramName = raw.paramName;
    const name = raw.name;
    const status = raw.status;
    const visibility = raw.visibility;
    const explanation = raw.explanation;
    const settings = DictionarySettingsCreator.skeletonize(raw.settings);
    const createdDate = raw.createdDate?.toISOString() ?? undefined;
    const updatedDate = raw.updatedDate?.toISOString() ?? undefined;
    const skeleton = {id, number, paramName, name, status, visibility, explanation, settings, createdDate, updatedDate};
    return skeleton;
  }

  export async function skeletonizeWithUser(raw: Dictionary): Promise<DictionarySkeletonWithUser> {
    const base = skeletonize(raw);
    const [user] = await Promise.all([(async () => {
      await raw.populate("user");
      if (isDocument(raw.user)) {
        return UserCreator.skeletonize(raw.user);
      } else {
        throw new Error("cannot happen");
      }
    })()]);
    const skeleton = {...base, user};
    return skeleton;
  }

  export async function skeletonizeWithAuthorities(raw: Dictionary, rawUser: User): Promise<DictionarySkeletonWithAuthorities> {
    const [base, authorities] = await Promise.all([skeletonizeWithUser(raw), raw.fetchAuthorities(rawUser)]);
    const skeleton = {...base, authorities};
    return skeleton;
  }

}