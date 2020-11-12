//

import {
  DocumentType,
  Ref,
  getModelForClass,
  isDocument,
  isDocumentArray,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import {
  Invitation as InvitationSkeleton
} from "/client/skeleton/invitation";
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
    await this.assure(type, dictionary, user);
    let createdDate = new Date();
    let invitation = new InvitationModel({type, dictionary, user, createdDate});
    await invitation.save();
    return invitation;
  }

  private static async assure(type: InvitationType, dictionary: Dictionary, user: User): Promise<void> {
    if (type === "edit") {
      let canEdit = await dictionary.hasAuthority(user, "edit");
      if (canEdit) {
        throw new CustomError("userCanAlreadyEdit");
      }
    } else if (type === "transfer") {
      let canOwn = await dictionary.hasAuthority(user, "own");
      if (canOwn) {
        throw new CustomError("userCanAlreadyOwn");
      }
    } else {
      throw new Error("cannot happen");
    }
    let formerInvitation = await InvitationModel.findOne().where("type", type).where("dictionary", dictionary).where("user", user);
    if (formerInvitation !== null) {
      if (type === "edit") {
        throw new CustomError("editInvitationAlreadyAdded");
      } else if (type === "transfer") {
        throw new CustomError("transferInvitationAlreadyAdded");
      } else {
        throw new Error("cannot happen");
      }
    }
  }

  public static async fetchByUser(type: InvitationType, user: User): Promise<Array<Invitation>> {
    let invitations = await InvitationModel.find().where("type", type).where("user", user).sort("-createdDate");
    return invitations;
  }

  public async respond(this: Invitation, user: User, accept: boolean): Promise<void> {
    await this.populate("user").execPopulate();
    if (isDocument(this.user) && this.user.id === user.id) {
      if (accept) {
        let type = this.type;
        if (type === "edit") {
          await this.respondEdit(user);
        } else if (type === "transfer") {
          await this.respondTransfer(user);
        }
      }
      await this.deleteOne();
    } else {
      throw new CustomError("forbidden");
    }
  }

  private async respondEdit(this: Invitation, user: User): Promise<void> {
    await this.populate("dictionary").execPopulate();
    if (isDocument(this.dictionary)) {
      this.dictionary.editUsers = [...this.dictionary.editUsers, user];
      await this.dictionary.save();
    }
  }

  private async respondTransfer(this: Invitation, user: User): Promise<void> {
    await this.populate("dictionary").execPopulate();
    if (isDocument(this.dictionary)) {
      await this.dictionary.populate("user").populate("editUsers").execPopulate();
      if (isDocument(this.dictionary.user) && isDocumentArray(this.dictionary.editUsers)) {
        let previousUser = this.dictionary.user;
        let nextEditUsers = this.dictionary.editUsers.filter((editUser) => editUser.id !== user.id && editUser.id !== previousUser.id);
        this.dictionary.user = user;
        this.dictionary.editUsers = [...nextEditUsers, previousUser];
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