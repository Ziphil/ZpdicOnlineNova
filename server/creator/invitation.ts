//

import {isDocument} from "@typegoose/typegoose";
import type {
  Invitation as InvitationSkeleton
} from "/client/skeleton";
import {DictionaryCreator} from "/server/creator/dictionary/dictionary";
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
