//

import {
  DocumentType,
  Ref,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import {
  Dictionary,
  DictionarySchema
} from "/server/model/dictionary";
import {
  CustomError
} from "/server/model/error";
import {
  User,
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

  public static async createEdit(dictionary: Dictionary, user: User): Promise<AccessInvitation> {
    let canEdit = await dictionary.canEdit(user);
    if (canEdit) {
      throw new CustomError("userCanAlreadyEdit");
    } else {
      let formerInvitation = await AccessInvitationModel.findOne().where("type", "edit").where("dictionary", dictionary).where("user", user);
      if (formerInvitation) {
        throw new CustomError("editDictionaryAlreadyInvited");
      } else {
        let invitation = new AccessInvitationModel({type: "edit", dictionary, user});
        await invitation.save();
        return invitation;
      }
    }
  }

}


export type AccessInvitation = DocumentType<AccessInvitationSchema>;
export let AccessInvitationModel = getModelForClass(AccessInvitationSchema);