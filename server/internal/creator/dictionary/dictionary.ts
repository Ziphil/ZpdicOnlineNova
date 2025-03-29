//

import {isDocument} from "@typegoose/typegoose";
import type {
  Dictionary as DictionarySkeleton,
  DictionaryWithAuthorities as DictionarySkeletonWithAuthorities,
  DictionaryWithUser as DictionarySkeletonWithUser
} from "/client/skeleton";
import {DictionarySettingsCreator} from "/server/internal/creator/dictionary/dictionary-settings";
import {UserCreator} from "/server/internal/creator/user/user";
import {
  Dictionary,
  User
} from "/server/model";


export namespace DictionaryCreator {

  export function skeletonize(raw: Dictionary): DictionarySkeleton {
    const skeleton = {
      id: raw.id || raw["_id"],
      number: raw.number,
      paramName: raw.paramName,
      name: raw.name,
      status: raw.status,
      visibility: raw.visibility,
      explanation: raw.explanation,
      settings: DictionarySettingsCreator.skeletonize(raw.settings),
      createdDate: raw.createdDate?.toISOString() ?? undefined,
      updatedDate: raw.updatedDate?.toISOString() ?? undefined
    } satisfies DictionarySkeleton;
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