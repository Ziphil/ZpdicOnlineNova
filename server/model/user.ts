//

import {
  DocumentType,
  getModelForClass,
  prop
} from "@hasezoey/typegoose";
import * as bcrypt from "bcrypt";
import {
  CustomError
} from "/server/model/error";


const EMAIL_VALIDATION = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const SALT_ROUND = 10;


export class User {

  @prop({required: true, unique: true, validate: /^[a-zA-Z0-9_-]+$/})
  public name!: string;

  @prop({required: true, validate: EMAIL_VALIDATION})
  public email!: string;

  @prop({required: true})
  public hash!: string;

  private encryptPassword(password: string): void {
    let length = password.length;
    if (length < 6 || length > 50) {
      throw new CustomError("invalidPassword");
    }
    this.hash = bcrypt.hashSync(password, SALT_ROUND);
  }

  private comparePassword(password: string): boolean {
    return bcrypt.compareSync(password, this.hash);
  }

  // 渡された情報からユーザーを作成し、データベースに保存します。
  // このとき、名前が妥当な文字列かどうか、およびすでに同じ名前のユーザーが存在しないかどうかを検証し、不適切だった場合はエラーを発生させます。
  // 渡されたパスワードは自動的にハッシュ化されます。
  public static async register(name: string, email: string, password: string): Promise<UserDocument> {
    let formerUser = await UserModel.findOne().where("name", name).exec();
    if (formerUser) {
      throw new CustomError("duplicateName");
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

}


export class UserSkeleton {

  public id: string;
  public name: string;
  public email: string;

  public constructor(user: UserDocument) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
  }

}


export type UserDocument = DocumentType<User>;
export let UserModel = getModelForClass(User);