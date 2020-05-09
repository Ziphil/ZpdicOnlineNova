//

import {
  DocumentType,
  Ref,
  getModelForClass,
  isDocument,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import {
  Dictionary,
  DictionaryCreator,
  DictionarySchema
} from "/server/model/dictionary";
import {
  CustomError
} from "/server/model/error";
import {
  User,
  UserSchema
} from "/server/model/user";
import {
  AccessInvitation as AccessInvitationSkeleton
} from "/server/skeleton/access-invitation";


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

  public static async findByUser(user: User): Promise<Array<AccessInvitation>> {
    let invitations = await AccessInvitationModel.find().where("user", user);
    return invitations;
  }

}


export class AccessInvitationCreator {

  public static async create(raw: AccessInvitation): Promise<AccessInvitationSkeleton> {
    await raw.populate("dictionary").execPopulate();
    if (isDocument(raw.dictionary)) {
      let id = raw.id;
      let type = raw.type;
      let dictionary = DictionaryCreator.create(raw.dictionary);
      let skeleton = AccessInvitationSkeleton.of({id, type, dictionary});
      return skeleton;
    } else {
      throw new Error("cannot happen");
    }
  }

}


export type AccessInvitation = DocumentType<AccessInvitationSchema>;
export let AccessInvitationModel = getModelForClass(AccessInvitationSchema);