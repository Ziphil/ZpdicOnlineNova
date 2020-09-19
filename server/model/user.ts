//

import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import {
  compareSync,
  hashSync
} from "bcrypt";
import {
  get as levenshtein
} from "fast-levenshtein";
import {
  DictionaryModel
} from "/server/model/dictionary";
import {
  CustomError
} from "/server/model/error";
import {
  ResetTokenModel,
  ResetTokenSchema
} from "/server/model/reset-token";
import {
  EMAIL_REGEXP,
  IDENTIFIER_REGEXP,
  validatePassword
} from "/server/model/validation";
import {
  DetailedUser as DetailedUserSkeleton,
  User as UserSkeleton
} from "/server/skeleton/user";
import {
  createRandomString
} from "/server/util/misc";
import {
  QueryRange
} from "/server/util/query";


@modelOptions({schemaOptions: {collection: "users"}})
export class UserSchema {

  @prop({required: true, unique: true, validate: IDENTIFIER_REGEXP})
  public name!: string;

  @prop({required: true})
  public screenName!: string;

  @prop({required: true, validate: EMAIL_REGEXP})
  public email!: string;

  @prop({required: true})
  public hash!: string;

  @prop()
  public resetToken?: ResetTokenSchema;

  @prop()
  public authority?: string;

  // 渡された情報からユーザーを作成し、データベースに保存します。
  // このとき、名前が妥当な文字列かどうか、およびすでに同じ名前のユーザーが存在しないかどうかを検証し、不適切だった場合はエラーを発生させます。
  // 渡されたパスワードは自動的にハッシュ化されます。
  public static async register(name: string, email: string, password: string): Promise<User> {
    let formerNameUser = await UserModel.findOne().where("name", name);
    let formerEmailUser = await UserModel.findOne().where("email", email);
    if (formerNameUser) {
      throw new CustomError("duplicateUserName");
    } else if (formerEmailUser) {
      throw new CustomError("duplicateUserEmail");
    } else {
      let screenName = "@" + name;
      let user = new UserModel({name, screenName, email});
      await user.encryptPassword(password);
      await user.validate();
      let result = await user.save();
      return result;
    }
  }

  // 渡された名前とパスワードに合致するユーザーを返します。
  // 渡された名前のユーザーが存在しない場合や、パスワードが誤っている場合は、null を返します。
  public static async authenticate(name: string, password: string): Promise<User | null> {
    let user = await UserModel.findOne().where("name", name);
    if (user && user.comparePassword(password)) {
      return user;
    } else {
      return null;
    }
  }

  public static async findOneByName(name: string): Promise<User | null> {
    let user = await UserModel.findOne().where("name", name);
    return user;
  }

  public static async findOneAdministrator(): Promise<User | null> {
    let user = await UserModel.findOne().where("authority", "admin");
    return user;
  }

  public static async suggest(query: string, range?: QueryRange): Promise<Array<User>> {
    let iterable = UserModel.find() as unknown as AsyncIterable<User>;
    let results = [];
    for await (let user of iterable) {
      let nameScore = levenshtein(query, user.name);
      let screenNameScore = levenshtein(query, user.screenName);
      let score = -Math.min(nameScore, screenNameScore);
      results.push({user, score});
    }
    results.sort((first, second) => second.score - first.score);
    let users = QueryRange.restrict(results.map((result) => result.user), range);
    return users;
  }

  public static async issueResetToken(name: string, email: string): Promise<{user: User, key: string}> {
    let user = await UserModel.findOne().where("name", name).where("email", email);
    if (user && user.authority !== "admin") {
      let name = createRandomString(10, true);
      let secret = createRandomString(30, false);
      let key = name + secret;
      let hash = hashSync(secret, 10);
      let date = new Date();
      let resetToken = new ResetTokenModel({name, hash, date});
      user.resetToken = resetToken;
      await user.save();
      return {user, key};
    } else {
      throw new CustomError("noSuchUser");
    }
  }

  // 与えられたリセットトークンのキーを用いてパスワードをリセットします。
  // パスワードのリセットに成功した場合と、トークンの有効期限が切れていた場合は、再び同じトークンを使えないようトークンを削除します。
  // パスワードが不正 (文字数が少ないなど) だった場合は、トークンは削除しません。
  public static async resetPassword(key: string, password: string, timeout: number): Promise<User> {
    let name = key.substring(0, 23);
    let secret = key.substring(23, 53);
    let user = await UserModel.findOne().where("resetToken.name", name);
    if (user && user.resetToken && compareSync(secret, user.resetToken.hash)) {
      let createdDate = user.resetToken.date;
      let currentDate = new Date();
      let elapsedMinute = (currentDate.getTime() - createdDate.getTime()) / (60 * 1000);
      if (elapsedMinute < timeout) {
        await user.changePassword(password);
        await user.purgeResetToken();
        return user;
      } else {
        await user.purgeResetToken();
        throw new CustomError("invalidResetToken");
      }
    } else {
      throw new CustomError("invalidResetToken");
    }
  }

  public async removeWhole(this: User): Promise<User> {
    let dictionaries = await DictionaryModel.findByUser(this, "own");
    let promises = dictionaries.map((dictionary) => {
      return dictionary.removeWhole();
    });
    await Promise.all(promises);
    await this.remove();
    return this;
  }

  public async changeScreenName(this: User, screenName: string): Promise<User> {
    this.screenName = screenName;
    await this.save();
    return this;
  }

  public async changeEmail(this: User, email: string): Promise<User> {
    let formerUser = await UserModel.findOne().where("email", email);
    if (formerUser && formerUser.id !== this.id) {
      throw new CustomError("duplicateUserEmail");
    } else {
      this.email = email;
      await this.save();
      return this;
    }
  }

  public async changePassword(this: User, password: string): Promise<User> {
    this.encryptPassword(password);
    await this.save();
    return this;
  }

  public async purgeResetToken(this: User): Promise<User> {
    this.resetToken = undefined;
    await this.save();
    return this;
  }

  // 引数に渡された生パスワードをハッシュ化して、自身のプロパティを上書きします。
  // データベースへの保存は行わないので、別途保存処理を行ってください。
  private encryptPassword(password: string): void {
    if (!validatePassword(password)) {
      throw new CustomError("invalidUserPassword");
    } else {
      let hash = hashSync(password, 10);
      this.hash = hash;
    }
  }

  private comparePassword(password: string): boolean {
    return compareSync(password, this.hash);
  }

}


export class UserCreator {

  public static create(raw: User): UserSkeleton {
    let id = raw.id;
    let name = raw.name;
    let screenName = raw.screenName;
    let skeleton = UserSkeleton.of({id, name, screenName});
    return skeleton;
  }

  public static createDetailed(raw: User): DetailedUserSkeleton {
    let base = UserCreator.create(raw);
    let email = raw.email;
    let skeleton = DetailedUserSkeleton.of({...base, email});
    return skeleton;
  }

}


export type User = DocumentType<UserSchema>;
export let UserModel = getModelForClass(UserSchema);