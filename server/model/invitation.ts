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
import {
  LiteralType,
  LiteralUtilType
} from "/server/util/literal-type";


export const INVITATION_TYPES = ["edit", "transfer"] as const;
export type InvitationType = LiteralType<typeof INVITATION_TYPES>;
export let InvitationTypeUtil = LiteralUtilType.create(INVITATION_TYPES);


@modelOptions({schemaOptions: {collection: "invitations"}})
export class InvitationSchema {

  @prop({required: true, enum: INVITATION_TYPES})
  public type!: InvitationType;

  @prop({required: true, ref: "DictionarySchema"})
  public dictionary!: Ref<DictionarySchema>;

  @prop({required: true, ref: "UserSchema"})
  public user!: Ref<UserSchema>;

  @prop({required: true})
  public createdDate!: Date;

  public static async add(type: InvitationType, dictionary: Dictionary, user: User): Promise<Invitation> {
    if (type === "edit") {
      return await this.addEdit(dictionary, user);
    } else if (type === "transfer") {
      throw new Error("not implemented");
    } else {
      throw new Error("cannot happen");
    }
  }

  private static async addEdit(dictionary: Dictionary, user: User): Promise<Invitation> {
    let canEdit = await dictionary.hasAuthority(user, "edit");
    if (canEdit) {
      throw new CustomError("userCanAlreadyEdit");
    } else {
      let formerInvitation = await InvitationModel.findOne().where("type", "edit").where("dictionary", dictionary).where("user", user);
      if (formerInvitation) {
        throw new CustomError("editDictionaryAlreadyInvited");
      } else {
        let invitation = new InvitationModel({});
        invitation.type = "edit";
        invitation.dictionary = dictionary;
        invitation.user = user;
        invitation.createdDate = new Date();
        await invitation.save();
        return invitation;
      }
    }
  }

  public static async findByUser(type: InvitationType, user: User): Promise<Array<Invitation>> {
    let invitations = await InvitationModel.find().where("type", type).where("user", user).sort("-createdDate");
    return invitations;
  }

  public async respond(this: Invitation, user: User, accept: boolean): Promise<void> {
    await this.populate("user").execPopulate();
    if (isDocument(this.user) && this.user.id === user.id) {
      let type = this.type;
      if (type === "edit") {
        await this.respondEdit(user, accept);
        await this.remove();
      } else if (type === "transfer") {
        throw new Error("not implemented");
      } else {
        throw new Error("cannot happen");
      }
    } else {
      throw new CustomError("forbidden");
    }
  }

  private async respondEdit(this: Invitation, user: User, accept: boolean): Promise<void> {
    if (accept) {
      await this.populate("dictionary").execPopulate();
      if (isDocument(this.dictionary)) {
        this.dictionary.editUsers = [...this.dictionary.editUsers, user];
        await this.dictionary.save();
      }
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