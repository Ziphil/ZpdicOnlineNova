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

  export async function create(raw: Invitation): Promise<InvitationSkeleton> {
    await raw.populate("dictionary");
    if (isDocument(raw.dictionary)) {
      const id = raw.id;
      const type = raw.type;
      const dictionary = await DictionaryCreator.createWithUser(raw.dictionary);
      const createdDate = raw.createdDate.toISOString();
      const skeleton = {id, type, dictionary, createdDate};
      return skeleton;
    } else {
      throw new Error("cannot happen");
    }
  }

}
