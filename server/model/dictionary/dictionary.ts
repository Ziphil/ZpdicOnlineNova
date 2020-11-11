//

import {
  DocumentType,
  Ref,
  getModelForClass,
  isDocument,
  isDocumentArray,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import Fuse from "fuse.js";
import {
  DetailedDictionary as DetailedDictionarySkeleton,
  Dictionary as DictionarySkeleton,
  EditWord as EditWordSkeleton,
  UserDictionary as UserDictionarySkeleton
} from "/client/skeleton/dictionary";
import {
  User as UserSkeleton
} from "/client/skeleton/user";
import {
  WithSize
} from "/server/controller/interface/type";
import {
  RemovableSchema
} from "/server/model/base";
import {
  DICTIONARY_AUTHORITIES,
  Deserializer,
  DictionaryAuthority,
  DictionaryAuthorityUtil,
  DictionaryFullAuthority,
  DictionarySettings,
  DictionarySettingsCreator,
  DictionarySettingsModel,
  Serializer,
  Suggestion,
  Word,
  WordModel,
  WordParameter
} from "/server/model/dictionary";
import {
  DictionarySettingsSchema
} from "/server/model/dictionary/dictionary-settings";
import {
  CustomError
} from "/server/model/error";
import {
  InvitationModel
} from "/server/model/invitation";
import {
  User,
  UserCreator,
  UserSchema
} from "/server/model/user";
import {
  IDENTIFIER_REGEXP
} from "/server/model/validation";
import {
  LiteralType,
  LiteralUtilType
} from "/server/util/literal-type";
import {
  LogUtil
} from "/server/util/log";
import {
  QueryRange
} from "/server/util/query";


export const DICTIONARY_STATUSES = ["ready", "saving", "error"] as const;
export type DictionaryStatus = LiteralType<typeof DICTIONARY_STATUSES>;
export let DictionaryStatusUtil = LiteralUtilType.create(DICTIONARY_STATUSES);


@modelOptions({schemaOptions: {collection: "dictionaries", minimize: false}})
export class DictionarySchema extends RemovableSchema {

  @prop({required: true, ref: "UserSchema"})
  public user!: Ref<UserSchema>;

  @prop({required: true, ref: "UserSchema"})
  public editUsers!: Array<Ref<UserSchema>>;

  @prop({required: true, unique: true})
  public number!: number;

  @prop({validate: IDENTIFIER_REGEXP})
  public paramName?: string;

  @prop({required: true})
  public name!: string;

  @prop({required: true, enum: DICTIONARY_STATUSES})
  public status!: DictionaryStatus;

  @prop({required: true})
  public secret!: boolean;

  @prop()
  public explanation?: string;

  @prop({required: true, type: DictionarySettingsSchema})
  public settings!: DictionarySettingsSchema;

  @prop({required: true, default: {}})
  public externalData!: object;

  @prop()
  public createdDate?: Date;

  @prop()
  public updatedDate?: Date;

  public static async addEmpty(name: string, user: User): Promise<Dictionary> {
    let dictionary = new DictionaryModel({});
    dictionary.user = user;
    dictionary.editUsers = [];
    dictionary.number = await DictionaryModel.fetchNextNumber();
    dictionary.name = name;
    dictionary.status = "ready";
    dictionary.secret = false;
    dictionary.settings = DictionarySettingsModel.createDefault();
    dictionary.externalData = {};
    dictionary.createdDate = new Date();
    dictionary.updatedDate = new Date();
    await dictionary.save();
    return dictionary;
  }

  public static async fetch(order: string, range?: QueryRange): Promise<WithSize<Dictionary>> {
    let sortArg = (order === "createdDate") ? "-createdDate -updatedDate -number" : "-updatedDate -number";
    let query = DictionaryModel.findExist().ne("secret", true).sort(sortArg);
    let result = await QueryRange.restrictWithSize(query, range);
    return result;
  }

  public static async fetchOneByNumber(number: number): Promise<Dictionary | null> {
    let dictionary = await DictionaryModel.findOneExist().where("number", number);
    return dictionary;
  }

  public static async fetchOneByValue(value: number | string): Promise<Dictionary | null> {
    let key = (typeof value === "number") ? "number" : "paramName";
    let dictionary = await DictionaryModel.findOneExist().where(key, value);
    return dictionary;
  }

  public static async fetchByUser(user: User, authority: DictionaryAuthority): Promise<Array<Dictionary>> {
    let ownQuery = DictionaryModel.findExist().where("user", user);
    let editQuery = DictionaryModel.findExist().where("editUsers", user);
    let rawQuery = (() => {
      if (authority === "own") {
        return ownQuery;
      } else {
        return DictionaryModel.findExist().or([ownQuery.getFilter(), editQuery.getFilter()]);
      }
    })();
    let query = rawQuery.sort("-updatedDate -number");
    let dictionaries = await query.exec();
    return dictionaries;
  }

  // この辞書に登録されている単語データを全て削除し、ファイルから読み込んだデータを代わりに保存します。
  // 辞書の内部データも、ファイルから読み込んだものに更新されます。
  public async upload(this: Dictionary, path: string, originalPath: string): Promise<Dictionary> {
    await this.startUpload();
    let settings = DictionarySettingsModel.createDefault() as any;
    let externalData = {};
    let anyThis = this as any;
    let promise = new Promise<Dictionary>((resolve, reject) => {
      let stream = Deserializer.create(path, originalPath, this);
      if (stream !== null) {
        let count = 0;
        stream.on("words", (words) => {
          WordModel.insertMany(words);
          count += words.length;
          LogUtil.log("dictionary/upload", `uploading: ${count}`);
          LogUtil.log("dictionary/upload", Object.entries(process.memoryUsage()).map(([key, value]) => `${key}: ${Math.round(value / 1024 / 1024 * 100) / 100}MB`).join(", "));
        });
        stream.on("property", (key, value) => {
          if (value !== undefined) {
            anyThis[key] = value;
          }
        });
        stream.on("settings", (key, value) => {
          if (value !== undefined) {
            settings[key] = value;
          }
        });
        stream.on("external", (key, data) => {
          externalData = Object.assign(externalData, {[key]: data});
        });
        stream.on("end", () => {
          this.status = "ready";
          this.settings = settings;
          this.externalData = externalData;
          resolve(this);
        });
        stream.on("error", (error) => {
          this.status = "error";
          LogUtil.error("dictionary/upload", "error occurred in uploading", error);
          resolve(this);
        });
        stream.start();
      } else {
        this.status = "error";
        resolve(this);
      }
    });
    await promise;
    await this.save();
    return this;
  }

  private async startUpload(this: Dictionary): Promise<void> {
    this.status = "saving";
    this.updatedDate = new Date();
    this.externalData = {};
    await this.save();
    await WordModel.flagRemoveMany().where("dictionary", this);
    LogUtil.log("dictionary/upload", `number: ${this.number}, start uploading`);
  }

  public async download(this: Dictionary, path: string): Promise<void> {
    let promise = new Promise<void>((resolve, reject) => {
      let stream = Serializer.create(path, this);
      if (stream !== null) {
        stream.on("end", () => {
          resolve();
        });
        stream.on("error", (error) => {
          reject(error);
        });
        stream.start();
      } else {
        reject();
      }
    });
    await promise;
  }

  // この辞書を削除 (削除フラグを付加) します。
  // 削除した辞書を後で削除する直前の状態に戻せるように、この辞書に属する単語データの削除は行いません。
  public async removeOne(this: Dictionary): Promise<void> {
    await InvitationModel.deleteMany({}).where("dictionary", this);
    await this.flagRemoveOne();
  }

  public async changeParamName(this: Dictionary, paramName: string): Promise<Dictionary> {
    if (paramName !== "") {
      let formerDictionary = await DictionaryModel.findOneExist().where("paramName", paramName);
      if (formerDictionary && formerDictionary.id !== this.id) {
        throw new CustomError("duplicateDictionaryParamName");
      }
      this.paramName = paramName;
    } else {
      this.paramName = undefined;
    }
    await this.save();
    return this;
  }

  public async changeName(this: Dictionary, name: string): Promise<Dictionary> {
    this.name = name;
    await this.save();
    return this;
  }

  public async changeSecret(this: Dictionary, secret: boolean): Promise<Dictionary> {
    this.secret = secret;
    await this.save();
    return this;
  }

  public async changeExplanation(this: Dictionary, explanation: string): Promise<Dictionary> {
    this.explanation = explanation;
    await this.save();
    return this;
  }

  public async changeSettings(this: Dictionary, settings: Partial<DictionarySettings>): Promise<Dictionary> {
    let anySettings = this.settings as any;
    for (let [key, value] of Object.entries(settings)) {
      if (value !== undefined) {
        anySettings[key] = value;
      }
    }
    await this.save();
    return this;
  }

  // この辞書に登録されている単語を編集します。
  // 渡された単語データと番号が同じ単語データがすでに存在する場合は、渡された単語データでそれを上書きします。
  // そうでない場合は、渡された単語データを新しいデータとして追加します。
  // 番号によってデータの修正か新規作成かを判断するので、既存の単語データの番号を変更する編集はできません。
  public async editWord(this: Dictionary, word: EditWordSkeleton): Promise<Word> {
    let currentWord = await WordModel.findOneExist().where("dictionary", this).where("number", word.number);
    let resultWord;
    if (currentWord) {
      resultWord = new WordModel(word);
      resultWord.dictionary = this;
      resultWord.createdDate = currentWord.createdDate;
      resultWord.updatedDate = new Date();
      await currentWord.flagRemoveOne();
      await resultWord.save();
      if (currentWord.name !== resultWord.name) {
        await this.correctRelationsByEdit(resultWord);
      }
    } else {
      if (word.number === undefined) {
        word.number = await this.fetchNextWordNumber();
      }
      resultWord = new WordModel(word);
      resultWord.dictionary = this;
      resultWord.createdDate = new Date();
      resultWord.updatedDate = new Date();
      await resultWord.save();
    }
    this.updatedDate = new Date();
    await this.save();
    LogUtil.log("dictionary/edit-word", {dictionary: {id: this.id, name: this.name}, current: currentWord?.id, result: resultWord.id});
    return resultWord;
  }

  public async removeWord(this: Dictionary, number: number): Promise<Word> {
    let word = await WordModel.findOneExist().where("dictionary", this).where("number", number);
    if (word) {
      await word.flagRemoveOne();
      await this.correctRelationsByRemove(word);
    } else {
      throw new CustomError("noSuchWordNumber");
    }
    LogUtil.log("dictionary/remove-word", {dictionary: {id: this.id, name: this.name}, current: word.id});
    return word;
  }

  private async correctRelationsByEdit(word: Word): Promise<void> {
    let affectedWords = await WordModel.findExist().where("dictionary", this).where("relations.number", word.number);
    for (let affectedWord of affectedWords) {
      for (let relation of affectedWord.relations) {
        if (relation.number === word.number) {
          relation.name = word.name;
        }
      }
    }
    let promises = affectedWords.map((affectedWord) => affectedWord.save());
    await Promise.all(promises);
  }

  private async correctRelationsByRemove(word: Word): Promise<void> {
    let affectedWords = await WordModel.findExist().where("dictionary", this).where("relations.number", word.number);
    for (let affectedWord of affectedWords) {
      affectedWord.relations = affectedWord.relations.filter((relation) => relation.number !== word.number);
    }
    let promises = affectedWords.map((affectedWord) => affectedWord.save());
    await Promise.all(promises);
  }

  // 与えられた検索パラメータを用いて辞書を検索し、ヒットした単語のリストとサジェストのリストを返します。
  public async search(this: Dictionary, parameter: WordParameter, range?: QueryRange): Promise<{words: WithSize<Word>, suggestions: Array<Suggestion>}> {
    let query = parameter.createQuery(this).sort("name");
    let suggestionAggregate = parameter.createSuggestionAggregate(this);
    let hitSuggestionPromise = suggestionAggregate?.then((suggestions) => {
      return suggestions.map((suggestion) => new Suggestion(suggestion.title, suggestion.word));
    });
    let [hitWordResult, hitSuggestions] = await Promise.all([QueryRange.restrictWithSize(query, range), hitSuggestionPromise]);
    return {words: hitWordResult, suggestions: hitSuggestions ?? []};
  }

  public async suggestTitles(propertyName: string, pattern: string): Promise<Array<string>> {
    let key = (() => {
      if (propertyName === "equivalent") {
        return "equivalents.title";
      } else if (propertyName === "tag") {
        return "tags";
      } else if (propertyName === "information") {
        return "informations.title";
      } else if (propertyName === "variation") {
        return "variations.title";
      } else if (propertyName === "relation") {
        return "relations.title";
      } else {
        return "";
      }
    })();
    let titles = await WordModel.findExist().where("dictionary", this).distinct(key);
    let hitTitles = (() => {
      if (pattern !== "") {
        let fuse = new Fuse(titles, {threshold: 1, distance: 40});
        return fuse.search(pattern).map((result) => result.item);
      } else {
        return titles.filter((title) => title !== "");
      }
    })();
    return hitTitles;
  }

  public async countWords(): Promise<number> {
    let count = await WordModel.findExist().where("dictionary", this).count();
    return count;
  }

  public async hasAuthority(this: Dictionary, user: User, authority: DictionaryAuthority): Promise<boolean> {
    await this.populate("user").populate("editUsers").execPopulate();
    if (isDocument(this.user) && isDocumentArray(this.editUsers)) {
      if (user.authority !== "admin") {
        if (authority === "own") {
          return this.user.id === user.id;
        } else if (authority === "edit") {
          return this.user.id === user.id || this.editUsers.find((editUser) => editUser.id === user.id) !== undefined;
        } else {
          throw new Error("cannot happen");
        }
      } else {
        return true;
      }
    } else {
      throw new Error("cannot happen");
    }
  }

  public async fetchAuthorities(this: Dictionary, user: User): Promise<Array<DictionaryAuthority>> {
    let promises = DICTIONARY_AUTHORITIES.map((authority) => {
      let promise = this.hasAuthority(user, authority).then((predicate) => {
        return (predicate) ? authority : null;
      });
      return promise;
    });
    let authorities = await Promise.all(promises);
    let filteredAuthorities = authorities.filter(DictionaryAuthorityUtil.is, DictionaryAuthorityUtil);
    return filteredAuthorities;
  }

  public async fetchAuthorizedUsers(this: Dictionary, authority: DictionaryFullAuthority): Promise<Array<User>> {
    await this.populate("user").populate("editUsers").execPopulate();
    if (isDocument(this.user) && isDocumentArray(this.editUsers)) {
      if (authority === "own") {
        return [this.user];
      } else if (authority === "edit") {
        return [this.user, ...this.editUsers];
      } else if (authority === "editOnly") {
        return this.editUsers;
      } else {
        throw new Error("cannot happen");
      }
    } else {
      throw new Error("cannot happen");
    }
  }

  public async removeAuthorizedUser(this: Dictionary, user: User): Promise<true> {
    await this.populate("editUsers").execPopulate();
    if (isDocumentArray(this.editUsers)) {
      let exist = this.editUsers.find((editUser) => editUser.id === user.id) !== undefined;
      if (exist) {
        this.editUsers = this.editUsers.filter((editUser) => editUser.id !== user.id);
        await this.save();
        return true;
      } else {
        throw new CustomError("noSuchDictionaryAuthorizedUser");
      }
    } else {
      throw new Error("cannot happen");
    }
  }

  private async fetchNextWordNumber(): Promise<number> {
    let words = await WordModel.find().where("dictionary", this).select("number").sort("-number").limit(1);
    if (words.length > 0) {
      return words[0].number + 1;
    } else {
      return 1;
    }
  }

  private static async fetchNextNumber(): Promise<number> {
    let dictionaries = await DictionaryModel.find().select("number").sort("-number").limit(1);
    if (dictionaries.length > 0) {
      return dictionaries[0].number + 1;
    } else {
      return 1;
    }
  }

}


export class DictionaryCreator {

  public static create(raw: Dictionary): DictionarySkeleton {
    let id = raw.id;
    let number = raw.number;
    let paramName = raw.paramName;
    let name = raw.name;
    let status = raw.status;
    let secret = raw.secret;
    let explanation = raw.explanation;
    let settings = DictionarySettingsCreator.create(raw.settings);
    let createdDate = raw.createdDate?.toISOString() ?? undefined;
    let updatedDate = raw.updatedDate?.toISOString() ?? undefined;
    let skeleton = DictionarySkeleton.of({id, number, paramName, name, status, secret, explanation, settings, createdDate, updatedDate});
    return skeleton;
  }

  public static async createDetailed(raw: Dictionary): Promise<DetailedDictionarySkeleton> {
    let base = DictionaryCreator.create(raw);
    let wordSizePromise = new Promise<number>(async (resolve, reject) => {
      try {
        let wordSize = await raw.countWords();
        resolve(wordSize);
      } catch (error) {
        reject(error);
      }
    });
    let userPromise = new Promise<UserSkeleton>(async (resolve, reject) => {
      try {
        await raw.populate("user").execPopulate();
        if (isDocument(raw.user)) {
          let user = UserCreator.create(raw.user);
          resolve(user);
        } else {
          reject();
        }
      } catch (error) {
        reject(error);
      }
    });
    let [wordSize, user] = await Promise.all([wordSizePromise, userPromise]);
    let skeleton = DetailedDictionarySkeleton.of({...base, wordSize, user});
    return skeleton;
  }

  public static async createUser(raw: Dictionary, rawUser: User): Promise<UserDictionarySkeleton> {
    let basePromise = DictionaryCreator.createDetailed(raw);
    let authoritiesPromise = raw.fetchAuthorities(rawUser);
    let [base, authorities] = await Promise.all([basePromise, authoritiesPromise]);
    let skeleton = UserDictionarySkeleton.of({...base, authorities});
    return skeleton;
  }

}


export type Dictionary = DocumentType<DictionarySchema>;
export let DictionaryModel = getModelForClass(DictionarySchema);