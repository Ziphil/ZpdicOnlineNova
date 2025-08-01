//

import {DateString, ObjectId} from "/server/internal/skeleton/common";
import {DictionaryWithUser} from "/server/internal/skeleton/dictionary/dictionary";
import {LiteralType, LiteralUtilType} from "/server/util/literal-type";


export interface Invitation {

  id: ObjectId;
  type: InvitationType;
  dictionary: DictionaryWithUser;
  createdDate: DateString;

}


export const INVITATION_TYPES = ["edit", "transfer"] as const;
export type InvitationType = LiteralType<typeof INVITATION_TYPES>;
export const InvitationTypeUtil = LiteralUtilType.create(INVITATION_TYPES);