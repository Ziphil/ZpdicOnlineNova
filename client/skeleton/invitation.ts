//

import {
  DetailedDictionary
} from "/client/skeleton/dictionary";
import {
  LiteralType,
  LiteralUtilType
} from "/server/util/literal-type";


export class Invitation {

  public id!: string;
  public type!: InvitationType;
  public dictionary!: DetailedDictionary;
  public createdDate!: string;

}


export const INVITATION_TYPES = ["edit", "transfer"] as const;
export type InvitationType = LiteralType<typeof INVITATION_TYPES>;
export let InvitationTypeUtil = LiteralUtilType.create(INVITATION_TYPES);