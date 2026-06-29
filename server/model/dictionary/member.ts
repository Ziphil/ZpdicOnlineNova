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

  public static async add(dictionary: Dictionary, user: User, authority: MemberAuthority): Promise<void> {
    const exist = await MemberModel.existMember(dictionary, user, authority);
    if (!exist) {
      const member = new MemberModel({dictionary, user, authority, createdDate: new Date()});
      await member.save();
    }
  }

  public static async discard(dictionary: Dictionary, user: User): Promise<boolean> {
    const result = await MemberModel.deleteMany({}).where("dictionary", dictionary).where("user", user);
    const exist = result.deletedCount > 0;
    return exist;
  }

  public static async existMember(dictionary: Dictionary, user: User, authority: MemberAuthority): Promise<boolean> {
    const count = await MemberModel.countDocuments().where("dictionary", dictionary).where("user", user).where("authority", authority);
    const exist = count > 0;
    return exist;
  }

  public static async fetchUsersByDictionary(dictionary: Dictionary, authority: MemberAuthority): Promise<Array<User>> {
    const members = await MemberModel.find().where("dictionary", dictionary).where("authority", authority).populate("user");
    const users = members.flatMap((member) => (isDocument(member.user)) ? [member.user] : []);
    return users;
  }

  public static async fetchDictionaryIdsByUser(user: Pick<User, "id">, authority: MemberAuthority): Promise<Array<Ref<DictionarySchema>>> {
    const members = await MemberModel.find().where("user", user).where("authority", authority).select("dictionary");
    const dictionaryIds = members.map((member) => member.dictionary);
    return dictionaryIds;
  }

}


export type Member = DocumentType<MemberSchema>;
export const MemberModel = getModelForClass(MemberSchema);
