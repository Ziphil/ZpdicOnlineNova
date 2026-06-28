//

import {
  DocumentType,
  Ref,
  getModelForClass,
  isDocument,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import {CustomError} from "/server/model/error";
import {User, UserSchema} from "/server/model/user/user";
import {createRandomString} from "/server/util/misc";


const MAX_API_CREDENTIAL_COUNT = 1;


@modelOptions({schemaOptions: {collection: "apiCredentials"}})
export class ApiCredentialSchema {

  @prop({required: true, ref: "UserSchema"})
  public user!: Ref<UserSchema>;

  @prop({required: true, unique: true})
  public key!: string;

  @prop()
  public createdDate?: Date;

  /** 渡されたユーザーに対して新しい API キーを発行し、その API キーデータを返します。
   * すでにそのユーザーが保持している API キーの数が上限に達している場合は、`apiCredentialCountExceeded` エラーを発生させます。*/
  public static async issue(user: User): Promise<ApiCredential> {
    const count = await ApiCredentialModel.countDocuments().where("user", user);
    if (count < MAX_API_CREDENTIAL_COUNT) {
      const key = createRandomString(64, false);
      const createdDate = new Date();
      const credential = new ApiCredentialModel({user, key, createdDate});
      await credential.save();
      return credential;
    } else {
      throw new CustomError("apiCredentialCountExceeded");
    }
  }

  public static async fetchByUser(user: User): Promise<Array<ApiCredential>> {
    const credentials = await ApiCredentialModel.find().where("user", user).exec();
    return credentials;
  }

  /** 渡された API キーに合致するユーザーを返します。
   * 合致するキーが存在しない場合は `null` を返します。*/
  public static async fetchUserByKey(key: string): Promise<User | null> {
    const credential = await ApiCredentialModel.findOne().where("key", key).populate("user").exec();
    const user = (credential !== null && isDocument(credential.user)) ? credential.user : null;
    return user;
  }

}


export type ApiCredential = DocumentType<ApiCredentialSchema>;
export const ApiCredentialModel = getModelForClass(ApiCredentialSchema);
