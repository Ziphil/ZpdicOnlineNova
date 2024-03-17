//

import {DetailedDictionary} from "/client/skeleton/dictionary/dictionary";
import {LiteralType, LiteralUtilType} from "/server/util/literal-type";


export interface Invitation {

  id: string;
  type: InvitationType;
  dictionary: DetailedDictionary;
  createdDate: string;

}


export const INVITATION_TYPES = ["edit", "transfer"] as const;
export type InvitationType = LiteralType<typeof INVITATION_TYPES>;
export const InvitationTypeUtil = LiteralUtilType.create(INVITATION_TYPES);