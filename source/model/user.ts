//

import {
  DocumentType,
  ReturnModelType,
  Typegoose,
  getModelForClass,
  prop
} from "@hasezoey/typegoose";
import * as bcrypt from "bcrypt";
import {
  Document,
  Schema
} from "mongoose";


const SALT_ROUND = 10;


export class User {

  @prop({required: true, unique: true})
  public name!: string;

  @prop({required: true})
  public email!: string;

  @prop({required: true})
  public hash!: string;

  private encryptPassword(password: string): void {
    this.hash = bcrypt.hashSync(password, SALT_ROUND);
  }

  // 渡された情報からユーザーを作成し、データベースに保存します。
  // パスワードは自動的にハッシュ化されます。
  public static register(name: string, email: string, password: string): Promise<UserDocument> {
    let user = new UserModel({name, email});
    user.encryptPassword(password);
    return user.save();
  }

  // 渡された名前とパスワードに合致するユーザーを返します。
  // 渡された名前のユーザーが存在しない場合や、パスワードが誤っている場合は、null を返します。
  public static async authenticate(name: string, password: string): Promise<UserDocument | null> {
    let user = await UserModel.findOne({name}).exec();
    if (user) {
      if (bcrypt.compareSync(password, user.hash)) {
        return user;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

}


export type UserDocument = DocumentType<User>;
export let UserModel = getModelForClass(User);