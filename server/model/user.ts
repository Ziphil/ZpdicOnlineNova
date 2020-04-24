//

import {
  DocumentType,
  getModelForClass,
  prop
} from "@hasezoey/typegoose";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import {
  CustomError
} from "/server/model/error";
import {
  EMAIL_VALIDATION,
  IDENTIFIER_VALIDATION,
  validatePassword
} from "/server/model/validation";


const SALT_ROUND = 10;


export class User {

  @prop({required: true, unique: true, validate: IDENTIFIER_VALIDATION})
  public name!: string;

  @prop({required: true, validate: EMAIL_VALIDATION})
  public email!: string;

  @prop({required: true})
  public hash!: string;

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

  public async resetPassword(this: UserDocument): Promise<{password: string, user: UserDocument}> {
    let password = this.generatePassword(16);
    this.encryptPassword(password);
    await this.save();
    return {password, user: this};
  }

  private generatePassword(length: number): string {
    let bytes = crypto.randomBytes(length);
    let password = bytes.toString("base64").substring(0, length);
    return password;
  }

  private encryptPassword(password: string): void {
    if (validatePassword(password)) {
      throw new CustomError("invalidPassword");
    }
    this.hash = bcrypt.hashSync(password, SALT_ROUND);
  }

  private comparePassword(password: string): boolean {
    return bcrypt.compareSync(password, this.hash);
  }

}


export type UserDocument = DocumentType<User>;
export let UserModel = getModelForClass(User);