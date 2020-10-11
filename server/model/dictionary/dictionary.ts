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
  WithSize
} from "/server/controller/type";
import {
  DICTIONARY_AUTHORITIES,
  Deserializer,
  DictionaryAuthority,
  DictionaryAuthorityUtil,
  DictionaryFullAuthority,
  SearchParameter,
  Serializer,
  Suggestion,
  Word,
  WordModel
} from "/server/model/dictionary";
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
  DetailedDictionary as DetailedDictionarySkeleton,
  Dictionary as DictionarySkeleton,
  EditWord as EditWordSkeleton,
  UserDictionary as UserDictionarySkeleton
} from "/server/skeleton/dictionary";
import {
  User as UserSkeleton
} from "/server/skeleton/user";
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
export class DictionarySchema {

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

  @prop()
  public snoj?: string;

  @prop()
  public createdDate?: Date;

  @prop()
  public updatedDate?: Date;

  @prop({required: true, default: {}})
  public externalData!: object;

  public static async createEmpty(name: string, user: User): Promise<Dictionary> {
    let dictionary = new DictionaryModel({});
    dictionary.user = user;
    dictionary.editUsers = [];
    dictionary.number = await DictionaryModel.fetchNextNumber();
    dictionary.name = name;
    dictionary.status = "ready";
    dictionary.secret = false;
    dictionary.createdDate = new Date();
    dictionary.updatedDate = new Date();
    dictionary.externalData = {};
    await dictionary.save();
    return dictionary;
  }

  public static async findPublic(order: string, range?: QueryRange): Promise<WithSize<Dictionary>> {
    let sortArg = (order === "createdDate") ? "-createdDate -updatedDate -number" : "-updatedDate -number";
    let query = DictionaryModel.find().ne("secret", true).sort(sortArg);
    let result = await QueryRange.restrictWithSize(query, range);
    return result;
  }

  public static async findOneByNumber(number: number): Promise<Dictionary | null> {
    let dictionary = await DictionaryModel.findOne().where("number", number);
    return dictionary;
  }

  public static async findOneByValue(value: number | string): Promise<Dictionary | null> {
    let key = (typeof value === "number") ? "number" : "paramName";
    let dictionary = await DictionaryModel.findOne().where(key, value);
    return dictionary;
  }

  public static async findByUser(user: User, authority: DictionaryAuthority): Promise<Array<Dictionary>> {
    let ownQuery = DictionaryModel.find().where("user", user);
    let editQuery = DictionaryModel.find().where("editUsers", user);
    let rawQuery = (() => {
      if (authority === "own") {
        return ownQuery;
      } else {
        return DictionaryModel.find().or([ownQuery.getFilter(), editQuery.getFilter()]);
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
    let externalData = {};
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
            let anyThis = this as any;
            anyThis[key] = value;
          }
        });
        stream.on("external", (key, data) => {
          externalData = Object.assign(externalData, {[key]: data});
        });
        stream.on("end", () => {
          this.status = "ready";
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
    await WordModel.deleteMany({}).where("dictionary", this);
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

  public async removeWhole(this: Dictionary): Promise<void> {
    await WordModel.deleteMany({}).where("dictionary", this);
    await InvitationModel.deleteMany({}).where("dictionary", this);
    await this.remove();
  }

  public async changeParamName(this: Dictionary, paramName: string): Promise<Dictionary> {
    if (paramName !== "") {
      let formerDictionary = await DictionaryModel.findOne().where("paramName", paramName);
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

  public async changeSnoj(this: Dictionary, snoj: string): Promise<Dictionary> {
    this.snoj = snoj;
    await this.save();
    return this;
  }

  public async getWords(): Promise<Array<Word>> {
    let words = await WordModel.find().where("dictionary", this);
    return words;
  }

  // この辞書に登録されている単語を編集します。
  // 渡された単語データと番号が同じ単語データがすでに存在する場合は、渡された単語データでそれを上書きします。
  // そうでない場合は、渡された単語データを新しいデータとして追加します。
  // 番号によってデータの修正か新規作成かを判断するので、既存の単語データの番号を変更する編集はできません。
  public async editWord(this: Dictionary, word: EditWordSkeleton): Promise<Word> {
    let currentWord = await WordModel.findOne().where("dictionary", this).where("number", word.number);
    let resultWord;
    if (currentWord) {
      resultWord = new WordModel(word);
      resultWord.dictionary = this;
      resultWord.createdDate = currentWord.createdDate;
      resultWord.updatedDate = new Date();
      await currentWord.remove();
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
    LogUtil.log("dictionary/edit-word", {currentWord, resultWord});
    return resultWord;
  }

  public async deleteWord(this: Dictionary, number: number): Promise<Word> {
    let word = await WordModel.findOne().where("dictionary", this).where("number", number);
    if (word) {
      await word.remove();
      await this.correctRelationsByDelete(word);
    } else {
      throw new CustomError("noSuchWordNumber");
    }
    LogUtil.log("dictionary/delete-word", {word});
    return word;
  }

  private async correctRelationsByEdit(word: Word): Promise<void> {
    let affectedWords = await WordModel.find().where("dictionary", this).where("relations.number", word.number);
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

  private async correctRelationsByDelete(word: Word): Promise<void> {
    let affectedWords = await WordModel.find().where("dictionary", this).where("relations.number", word.number);
    for (let affectedWord of affectedWords) {
      affectedWord.relations = affectedWord.relations.filter((relation) => relation.number !== word.number);
    }
    let promises = affectedWords.map((affectedWord) => affectedWord.save());
    await Promise.all(promises);
  }

  // 与えられた検索パラメータを用いて辞書を検索し、ヒットした単語のリストとサジェストのリストを返します。
  public async search(this: Dictionary, parameter: SearchParameter, range?: QueryRange): Promise<{words: WithSize<Word>, suggestions: Array<Suggestion>}> {
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
    let titles = await WordModel.where("dictionary", this).distinct(key);
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
    let count = await WordModel.countDocuments({}).where("dictionary", this);
    return count;
  }

  public async hasAuthority(this: Dictionary, user: User, authority: DictionaryAuthority): Promise<boolean> {
    await this.populate("user").populate("editUsers").execPopulate();
    if (isDocument(this.user) && isDocumentArray(this.editUsers)) {
      if (authority === "own") {
        return this.user.id === user.id;
      } else if (authority === "edit") {
        return this.user.id === user.id || this.editUsers.find((editUser) => editUser.id === user.id) !== undefined;
      } else {
        throw new Error("cannot happen");
      }
    } else {
      throw new Error("cannot happen");
    }
  }

  public async getAuthorities(this: Dictionary, user: User): Promise<Array<DictionaryAuthority>> {
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

  public async getAuthorizedUsers(this: Dictionary, authority: DictionaryFullAuthority): Promise<Array<User>> {
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

  public async deleteAuthorizedUser(this: Dictionary, user: User): Promise<true> {
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
    let snoj = raw.snoj;
    let createdDate = raw.createdDate?.toISOString() ?? undefined;
    let updatedDate = raw.updatedDate?.toISOString() ?? undefined;
    let skeleton = DictionarySkeleton.of({id, number, paramName, name, status, secret, explanation, snoj, createdDate, updatedDate});
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
    let authoritiesPromise = raw.getAuthorities(rawUser);
    let [base, authorities] = await Promise.all([basePromise, authoritiesPromise]);
    let skeleton = UserDictionarySkeleton.of({...base, authorities});
    return skeleton;
  }

}


export type Dictionary = DocumentType<DictionarySchema>;
export let DictionaryModel = getModelForClass(DictionarySchema);