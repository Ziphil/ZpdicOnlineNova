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
  Invitation as InvitationSkeleton
} from "/server/skeleton/invitation";


@modelOptions({schemaOptions: {collection: "invitations"}})
export class InvitationSchema {

  @prop({required: true})
  public type!: string;

  @prop({required: true, ref: "DictionarySchema"})
  public dictionary!: Ref<DictionarySchema>;

  @prop({required: true, ref: "UserSchema"})
  public user!: Ref<UserSchema>;

  @prop({required: true})
  public createdDate!: Date;

  public static async createEdit(dictionary: Dictionary, user: User): Promise<Invitation> {
    let canEdit = await dictionary.hasAuthority(user, "edit");
    if (canEdit) {
      throw new CustomError("userCanAlreadyEdit");
    } else {
      let formerInvitation = await InvitationModel.findOne().where("type", "edit").where("dictionary", dictionary).where("user", user);
      if (formerInvitation) {
        throw new CustomError("editDictionaryAlreadyInvited");
      } else {
        let createdDate = new Date();
        let invitation = new InvitationModel({type: "edit", dictionary, user, createdDate});
        await invitation.save();
        return invitation;
      }
    }
  }

  public static async findByUser(type: string, user: User): Promise<Array<Invitation>> {
    let invitations = await InvitationModel.find().where("type", type).where("user", user).sort("-updatedDate");
    return invitations;
  }

  public async respond(this: Invitation, user: User, accept: boolean): Promise<void> {
    await this.populate("user").execPopulate();
    if (isDocument(this.user) && this.user.id === user.id) {
      if (accept) {
        await this.populate("dictionary").execPopulate();
        if (isDocument(this.dictionary)) {
          this.dictionary.editUsers = [...this.dictionary.editUsers, user];
          await this.dictionary.save();
        }
      }
      await this.remove();
    } else {
      throw new CustomError("forbidden");
    }
  }

}


export class InvitationCreator {

  public static async create(raw: Invitation): Promise<InvitationSkeleton> {
    await raw.populate("dictionary").execPopulate();
    if (isDocument(raw.dictionary)) {
      let id = raw.id;
      let type = raw.type;
      let dictionary = await DictionaryCreator.createDetailed(raw.dictionary);
      let createdDate = raw.createdDate.toISOString();
      let skeleton = InvitationSkeleton.of({id, type, dictionary, createdDate});
      return skeleton;
    } else {
      throw new Error("cannot happen");
    }
  }

}


export type Invitation = DocumentType<InvitationSchema>;
export let InvitationModel = getModelForClass(InvitationSchema);