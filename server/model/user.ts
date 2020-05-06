//

import {
  DocumentType,
  getModelForClass,
  prop
} from "@hasezoey/typegoose";
import {
  compareSync,
  hashSync
} from "bcrypt";
import {
  CustomError
} from "/server/model/error";
import {
  ResetToken,
  ResetTokenDocument,
  ResetTokenModel
} from "/server/model/reset-token";
import {
  EMAIL_REGEXP,
  IDENTIFIER_REGEXP,
  validatePassword
} from "/server/model/validation";
import {
  createRandomString
} from "/server/util/misc";


export class User {

  @prop({required: true, unique: true, validate: IDENTIFIER_REGEXP})
  public name!: string;

  @prop({required: true, validate: EMAIL_REGEXP})
  public email!: string;

  @prop({required: true})
  public hash!: string;

  @prop()
  public resetToken?: ResetToken;

  @prop()
  public authority?: string;

  // 渡された情報からユーザーを作成し、データベースに保存します。
  // このとき、名前が妥当な文字列かどうか、およびすでに同じ名前のユーザーが存在しないかどうかを検証し、不適切だった場合はエラーを発生させます。
  // 渡されたパスワードは自動的にハッシュ化されます。
  public static async register(name: string, email: string, password: string): Promise<UserDocument> {
    let formerUser = await UserModel.findOne().where("name", name).exec();
    if (formerUser) {
      throw new CustomError("duplicateUserName");
    }
    let user = new UserModel({name, email});
    await user.encryptPassword(password);
    await user.validate();
    let result = await user.save();
    return result;
  }

  // 渡された名前とパスワードに合致するユーザーを返します。
  // 渡された名前のユーザーが存在しない場合や、パスワードが誤っている場合は、null を返します。
  public static async authenticate(name: string, password: string): Promise<UserDocument | null> {
    let user = await UserModel.findOne().where("name", name).exec();
    if (user && user.comparePassword(password)) {
      return user;
    } else {
      return null;
    }
  }

  public static async createResetToken(email: string): Promise<ResetTokenDocument> {
    let user = await UserModel.findOne().where("email", email).exec();
    if (user) {
      let date = new Date();
      let key = createRandomString(30, true);
      let resetToken = new ResetTokenModel({key, date});
      user.resetToken = resetToken;
      await user.save();
      return resetToken;
    } else {
      throw new CustomError("noSuchUserEmail");
    }
  }

  public static async resetPassword(key: string, password: string, timeout: number): Promise<UserDocument> {
    let user = await UserModel.findOne().where("resetToken.key", key).exec();
    if (user && user.resetToken) {
      let createdDate = user.resetToken.date;
      let currentDate = new Date();
      let elapsedMinute = (currentDate.getTime() - createdDate.getTime()) / (60 * 1000);
      if (elapsedMinute < timeout) {
        user.changePassword(password);
        return user;
      } else {
        throw new CustomError("invalidResetToken");
      }
    } else {
      throw new CustomError("invalidResetToken");
    }
  }

  public async changeEmail(this: UserDocument, email: string): Promise<UserDocument> {
    this.email = email;
    await this.save();
    return this;
  }

  public async changePassword(this: UserDocument, password: string): Promise<UserDocument> {
    this.encryptPassword(password);
    await this.save();
    return this;
  }

  private encryptPassword(password: string): void {
    if (!validatePassword(password)) {
      throw new CustomError("invalidPassword");
    }
    let hash = hashSync(password, 10);
    this.hash = hash;
  }

  private comparePassword(password: string): boolean {
    return compareSync(password, this.hash);
  }

}


export type UserDocument = DocumentType<User>;
export let UserModel = getModelForClass(User);