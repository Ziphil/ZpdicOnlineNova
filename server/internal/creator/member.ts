//

import {isDocument} from "@typegoose/typegoose";
import {UserCreator} from "/server/internal/creator/user/user";
import type {
  Member as MemberSkeleton
} from "/server/internal/skeleton";
import {
  Member
} from "/server/model";


export namespace MemberCreator {

  export async function skeletonize(raw: Member): Promise<MemberSkeleton> {
    await raw.populate("user");
    if (isDocument(raw.user)) {
      const skeleton = {
        id: raw.id,
        user: UserCreator.skeletonize(raw.user),
        authority: raw.authority,
        createdDate: raw.createdDate?.toISOString() ?? undefined
      } satisfies MemberSkeleton;
      return skeleton;
    } else {
      throw new Error("cannot happen");
    }
  }

}
