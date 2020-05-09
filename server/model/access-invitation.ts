//

import {
  DocumentType,
  Ref,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import {
  DictionarySchema
} from "/server/model/dictionary";
import {
  UserSchema
} from "/server/model/user";


@modelOptions({schemaOptions: {collection: "accessInvitations"}})
export class AccessInvitationSchema {

  @prop({required: true})
  public type!: string;

  @prop({required: true, ref: DictionarySchema})
  public dictionary!: Ref<DictionarySchema>;

  @prop({required: true, ref: UserSchema})
  public user!: Ref<UserSchema>;

}


export type AccessInvitation = DocumentType<AccessInvitationSchema>;
export let AccessInvitationModel = getModelForClass(AccessInvitationSchema);