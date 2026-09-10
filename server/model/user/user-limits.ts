//

import {getModelForClass, modelOptions, prop} from "@typegoose/typegoose";
import {DeepRequired} from "ts-essentials";
import {DEFAULT_USER_LIMITS} from "/server/model/constant";


@modelOptions({schemaOptions: {autoCreate: false, collection: "userLimits"}})
export class UserLimitsSchema {

  @prop()
  public dictionaryCount?: number;

  @prop()
  public apiCredentialCount?: number;

  /** 設定されていない項目を既定値で補完した上限値を返します。
   * 上限値の検査は、必ずこのメソッドを通して得た値に対して行ってください。*/
  public resolve(this: UserLimits): ResolvedUserLimits {
    const resolvedLimits = {
      dictionaryCount: this.dictionaryCount ?? DEFAULT_USER_LIMITS.dictionaryCount,
      apiCredentialCount: this.apiCredentialCount ?? DEFAULT_USER_LIMITS.apiCredentialCount
    } satisfies ResolvedUserLimits;
    return resolvedLimits;
  }

  public static createDefault(): UserLimits {
    const limits = new UserLimitsModel({});
    return limits;
  }

}


export type ResolvedUserLimits = DeepRequired<Pick<UserLimitsSchema, "dictionaryCount" | "apiCredentialCount">>;

export type UserLimits = UserLimitsSchema;
export const UserLimitsModel = getModelForClass(UserLimitsSchema);
