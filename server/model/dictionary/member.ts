//

import {
  DocumentType,
  Ref,
  getModelForClass,
  isDocument,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import {Dictionary, DictionarySchema} from "/server/model/dictionary/dictionary";
import {MEMBER_AUTHORITIES, MemberAuthority} from "/server/model/dictionary/member-authority";
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

  /** 指定された辞書に指定されたユーザーをメンバーとして追加します。
   * 既に同じ権限のメンバーとして登録されている場合は、何もしません。*/
  public static async add(dictionary: Dictionary, user: User, authority: MemberAuthority): Promise<void> {
    const exists = await MemberModel.existsMember(dictionary, user, authority);
    if (!exists) {
      const member = new MemberModel({dictionary, user, authority, createdDate: new Date()});
      await member.save();
    }
  }

  /** 指定された辞書から、指定されたユーザーのメンバー登録を全て削除します。
   * 削除されたメンバーが存在したかどうかを返します。*/
  public static async discard(dictionary: Dictionary, user: User): Promise<boolean> {
    const result = await MemberModel.deleteMany({}).where("dictionary", dictionary).where("user", user);
    const existed = result.deletedCount > 0;
    return existed;
  }

  /** 指定された辞書・ユーザー・権限に合致するメンバーが存在するかどうかを判定します。*/
  public static async existsMember(dictionary: Dictionary, user: User, authority: MemberAuthority): Promise<boolean> {
    const count = await MemberModel.countDocuments().where("dictionary", dictionary).where("user", user).where("authority", authority);
    const exists = count > 0;
    return exists;
  }

  /** 指定された辞書に属する、指定された権限をもつメンバーのユーザーを全て返します。*/
  public static async fetchUsersByDictionary(dictionary: Dictionary, authority: MemberAuthority): Promise<Array<User>> {
    const members = await MemberModel.find().where("dictionary", dictionary).where("authority", authority).populate("user");
    const users = members.flatMap((member) => (isDocument(member.user)) ? [member.user] : []);
    return users;
  }

  /** 指定されたユーザーが指定された権限をもつメンバーとして属している辞書の ID を全て返します。*/
  public static async fetchDictionaryIdsByUser(user: Pick<User, "id">, authority: MemberAuthority): Promise<Array<Ref<DictionarySchema>>> {
    const members = await MemberModel.find().where("user", user).where("authority", authority).select("dictionary");
    const dictionaryIds = members.map((member) => member.dictionary);
    return dictionaryIds;
  }

}


export type Member = DocumentType<MemberSchema>;
export const MemberModel = getModelForClass(MemberSchema);
