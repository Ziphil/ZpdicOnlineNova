//

import {isDocument} from "@typegoose/typegoose";
import {DictionaryCreator} from "/server/internal/creator/dictionary/dictionary";
import type {
  Invitation as InvitationSkeleton
} from "/server/internal/skeleton";
import {
  Invitation
} from "/server/model";


export namespace InvitationCreator {

  export async function skeletonize(raw: Invitation): Promise<InvitationSkeleton> {
    await raw.populate("dictionary");
    if (isDocument(raw.dictionary)) {
      const skeleton = {
        id: raw.id,
        type: raw.type,
        dictionary: await DictionaryCreator.skeletonizeWithUser(raw.dictionary),
        createdDate: raw.createdDate.toISOString()
      } satisfies InvitationSkeleton;
      return skeleton;
    } else {
      throw new Error("cannot happen");
    }
  }

}
