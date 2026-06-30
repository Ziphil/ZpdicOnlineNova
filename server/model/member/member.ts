//

import {
  DocumentType,
  Ref,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import {Dictionary, DictionarySchema} from "/server/model/dictionary/dictionary";
import {CustomError} from "/server/model/error";
import {MEMBER_AUTHORITIES, MemberAuthority} from "/server/model/member/member-authority";
import {User, UserSchema} from "/server/model/user/user";


@modelOptions({schemaOptions: {collection: "members"}})
export class MemberSchema {

  @prop({required: true, ref: "DictionarySchema"})
  public dictionary!: Ref<DictionarySchema>;

  @prop({required: true, ref: "UserSchema"})
  public user!: Ref<UserSchema>;

  @prop({required: true, enum: MEMBER_AUTHORITIES})
  public authority!: MemberAuthority;

  @prop()
  public createdDate?: Date;

  public static async add(dictionary: Dictionary, user: User, authority: MemberAuthority): Promise<void> {
    const exist = await MemberModel.existMember(dictionary, user, authority);
    if (!exist) {
      const member = new MemberModel({dictionary, user, authority, createdDate: new Date()});
      await member.save();
    }
  }

  public static async discard(dictionary: Dictionary, user: User): Promise<void> {
    const member = await MemberModel.findOne().where("dictionary", dictionary).where("user", user);
    if (member !== null) {
      await member.deleteOne();
    } else {
      throw new CustomError("noSuchMember");
    }
  }

  public static async existMember(dictionary: Dictionary, user: User, authority: MemberAuthority): Promise<boolean> {
    const count = await MemberModel.countDocuments().where("dictionary", dictionary).where("user", user).where("authority", authority);
    const exist = count > 0;
    return exist;
  }

  public static async fetchByDictionary(dictionary: Dictionary, authority: MemberAuthority): Promise<Array<Member>> {
    const members = await MemberModel.find().where("dictionary", dictionary).where("authority", authority).populate("user");
    return members;
  }

  public static async fetchDictionaryIdsByUser(user: Pick<User, "id">, authority: MemberAuthority): Promise<Array<Ref<DictionarySchema>>> {
    const members = await MemberModel.find().where("user", user).where("authority", authority).select("dictionary");
    const dictionaryIds = members.map((member) => member.dictionary);
    return dictionaryIds;
  }

}


export type Member = DocumentType<MemberSchema>;
export const MemberModel = getModelForClass(MemberSchema);
