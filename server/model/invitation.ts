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
} from "/client-new/skeleton";
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
export const InvitationTypeUtil = LiteralUtilType.create(INVITATION_TYPES);


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
    const createdDate = new Date();
    const invitation = new InvitationModel({type, dictionary, user, createdDate});
    await invitation.save();
    return invitation;
  }

  private static async assure(type: InvitationType, dictionary: Dictionary, user: User): Promise<void> {
    if (type === "edit") {
      const canEdit = await dictionary.hasAuthority(user, "edit");
      if (canEdit) {
        throw new CustomError("userCanAlreadyEdit");
      }
    } else if (type === "transfer") {
      const canOwn = await dictionary.hasAuthority(user, "own");
      if (canOwn) {
        throw new CustomError("userCanAlreadyOwn");
      }
    } else {
      throw new Error("cannot happen");
    }
    const formerInvitation = await InvitationModel.findOne().where("type", type).where("dictionary", dictionary).where("user", user);
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
    const invitations = await InvitationModel.find().where("type", type).where("user", user).sort("-createdDate");
    return invitations;
  }

  public async respond(this: Invitation, user: User, accept: boolean): Promise<void> {
    await this.populate("user");
    if (isDocument(this.user) && this.user.id === user.id) {
      if (accept) {
        const type = this.type;
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
    await this.populate("dictionary");
    if (isDocument(this.dictionary)) {
      this.dictionary.editUsers = [...this.dictionary.editUsers, user];
      await this.dictionary.save();
    }
  }

  private async respondTransfer(this: Invitation, user: User): Promise<void> {
    await this.populate("dictionary");
    if (isDocument(this.dictionary)) {
      await this.dictionary.populate(["user", "editUsers"]);
      if (isDocument(this.dictionary.user) && isDocumentArray(this.dictionary.editUsers)) {
        const previousUser = this.dictionary.user;
        const nextEditUsers = this.dictionary.editUsers.filter((editUser) => editUser.id !== user.id && editUser.id !== previousUser.id);
        this.dictionary.user = user;
        this.dictionary.editUsers = [...nextEditUsers, previousUser];
        await this.dictionary.save();
      }
    }
  }

}


export class InvitationCreator {

  public static async create(raw: Invitation): Promise<InvitationSkeleton> {
    await raw.populate("dictionary");
    if (isDocument(raw.dictionary)) {
      const id = raw.id;
      const type = raw.type;
      const dictionary = await DictionaryCreator.createDetailed(raw.dictionary);
      const createdDate = raw.createdDate.toISOString();
      const skeleton = {id, type, dictionary, createdDate};
      return skeleton;
    } else {
      throw new Error("cannot happen");
    }
  }

}


export type Invitation = DocumentType<InvitationSchema>;
export const InvitationModel = getModelForClass(InvitationSchema);