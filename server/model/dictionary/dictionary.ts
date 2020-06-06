//

import {
  DocumentType,
  Ref,
  arrayProp,
  getModelForClass,
  isDocument,
  isDocumentArray,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import {
  DocumentQuery
} from "mongoose";
import {
  DICTIONARY_AUTHORITIES,
  Deserializer,
  DictionaryAuthority,
  Serializer,
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
  NormalSearchParameter
} from "/server/model/search-parameter";
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
  takeErrorLog,
  takeLog
} from "/server/util/misc";
import {
  QueryUtil
} from "/server/util/query";


@modelOptions({schemaOptions: {collection: "dictionaries", minimize: false}})
export class DictionarySchema {

  @prop({required: true, ref: "UserSchema"})
  public user!: Ref<UserSchema>;

  @arrayProp({required: true, ref: "UserSchema"})
  public editUsers!: Array<Ref<UserSchema>>;

  @prop({required: true, unique: true})
  public number!: number;

  @prop({validate: IDENTIFIER_REGEXP})
  public paramName?: string;

  @prop({required: true})
  public name!: string;

  @prop({required: true})
  public status!: string;

  @prop({required: true})
  public secret!: boolean;

  @prop()
  public explanation?: string;

  @prop()
  public updatedDate?: Date;

  @prop({required: true, default: {}})
  public externalData!: object;

  public static async createEmpty(name: string, user: User): Promise<Dictionary> {
    let dictionary = new DictionaryModel({});
    dictionary.user = user;
    dictionary.editUsers = [];
    dictionary.number = await DictionaryModel.nextNumber();
    dictionary.name = name;
    dictionary.status = "ready";
    dictionary.secret = false;
    dictionary.updatedDate = new Date();
    dictionary.externalData = {};
    await dictionary.save();
    return dictionary;
  }

  public static async findPublic(): Promise<Array<Dictionary>> {
    let dictionaries = await DictionaryModel.find().ne("secret", true).sort("-updatedDate -number");
    return dictionaries;
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
    let query = (() => {
      if (authority === "own") {
        return ownQuery;
      } else {
        return DictionaryModel.find().or([ownQuery.getQuery(), editQuery.getQuery()]);
      }
    })();
    let dictionaries = await query.sort("-updatedDate -number");
    return dictionaries;
  }

  // この辞書に登録されている単語データを全て削除し、ファイルから読み込んだデータを代わりに保存します。
  // 辞書の内部データも、ファイルから読み込んだものに更新されます。
  public async upload(this: Dictionary, path: string, originalPath: string): Promise<Dictionary> {
    this.status = "saving";
    this.updatedDate = new Date();
    this.externalData = {};
    await this.save();
    await WordModel.deleteMany({}).where("dictionary", this);
    let externalData = {};
    let promise = new Promise<Dictionary>((resolve, reject) => {
      let stream = Deserializer.create(path, originalPath, this);
      if (stream !== null) {
        let count = 0;
        stream.on("words", (words) => {
          WordModel.insertMany(words);
          count += words.length;
          takeLog("dictionary/upload", `uploading: ${count}`);
          takeLog("dictionary/upload", Object.entries(process.memoryUsage()).map(([key, value]) => `${key}: ${Math.round(value / 1024 / 1024 * 100) / 100}MB`).join(", "));
        });
        stream.on("other", (key, data) => {
          externalData = Object.assign(externalData, {[key]: data});
        });
        stream.on("end", () => {
          this.status = "ready";
          resolve(this);
        });
        stream.on("error", (error) => {
          this.status = "error";
          takeErrorLog("dictionary/upload", "error occurred in uploading", error);
          resolve(this);
        });
        stream.start();
      } else {
        this.status = "error";
        resolve(this);
      }
    });
    takeLog("dictionary/upload", `number: ${this.number}, start uploading`);
    await promise;
    this.externalData = externalData;
    await this.save();
    return this;
  }

  public async download(this: Dictionary, path: string): Promise<void> {
    let promise = new Promise<void>((resolve, reject) => {
      let stream = new Serializer(path, this);
      stream.on("end", () => {
        resolve();
      });
      stream.on("error", (error) => {
        reject(error);
      });
      stream.start();
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
      await currentWord.remove();
      await resultWord.save();
      if (currentWord.name !== resultWord.name) {
        await this.correctRelationsByEdit(resultWord);
      }
    } else {
      if (word.number === undefined) {
        word.number = await this.nextWordNumber();
      }
      resultWord = new WordModel(word);
      resultWord.dictionary = this;
      await resultWord.save();
    }
    this.updatedDate = new Date();
    await this.save();
    takeLog("dictionary/edit-word", {currentWord, resultWord});
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
    takeLog("dictionary/delete-word", {word});
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

  public async search(parameter: NormalSearchParameter, offset?: number, size?: number): Promise<{hitSize: number, hitWords: Array<Word>}> {
    let search = parameter.search;
    let mode = parameter.mode;
    let type = parameter.type;
    let escapedSearch = search.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
    let outerThis = this;
    let createKey = function (innerMode: string): string {
      let key;
      if (innerMode === "name") {
        key = "name";
      } else if (innerMode === "equivalent") {
        key = "equivalents.names";
      } else if (innerMode === "information") {
        key = "informations.text";
      } else {
        key = "";
      }
      return key;
    };
    let createNeedle = function (innerType: string): string | RegExp {
      let needle;
      if (innerType === "exact") {
        needle = search;
      } else if (innerType === "prefix") {
        needle = new RegExp("^" + escapedSearch);
      } else if (type === "suffix") {
        needle = new RegExp(escapedSearch + "$");
      } else if (type === "part") {
        needle = new RegExp(escapedSearch);
      } else if (type === "regular") {
        try {
          needle = new RegExp(search);
        } catch (error) {
          needle = "";
        }
      } else {
        needle = "";
      }
      return needle;
    };
    let createAuxiliaryQuery = function (innerMode: string, innerType: string): DocumentQuery<Array<Word>, Word> {
      let key = createKey(innerMode);
      let needle = createNeedle(innerType);
      let query = WordModel.find().where("dictionary", outerThis).where(key, needle);
      return query;
    };
    let finalQuery;
    if (mode === "name") {
      finalQuery = createAuxiliaryQuery("name", type);
    } else if (mode === "equivalent") {
      finalQuery = createAuxiliaryQuery("equivalent", type);
    } else if (mode === "content") {
      let nameQuery = createAuxiliaryQuery("name", type);
      let equivalentQuery = createAuxiliaryQuery("equivalent", type);
      let informationQuery = createAuxiliaryQuery("information", type);
      finalQuery = WordModel.find().or([nameQuery.getQuery(), equivalentQuery.getQuery(), informationQuery.getQuery()]);
    } else if (mode === "both") {
      let nameQuery = createAuxiliaryQuery("name", type);
      let equivalentQuery = createAuxiliaryQuery("equivalent", type);
      finalQuery = WordModel.find().or([nameQuery.getQuery(), equivalentQuery.getQuery()]);
    } else {
      finalQuery = WordModel.find();
    }
    finalQuery = finalQuery.sort("name");
    let countQuery = WordModel.countDocuments(finalQuery.getQuery());
    let restrictedQuery = QueryUtil.restrict(finalQuery, offset, size);
    let hitSize = await countQuery.exec();
    let hitWords = await restrictedQuery.exec();
    return {hitSize, hitWords};
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
      } else {
        return this.user.id === user.id || this.editUsers.find((editUser) => editUser.id === user.id) !== undefined;
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
    let filteredAuthorities = authorities.filter((authority) => authority !== null);
    return filteredAuthorities as any;
  }

  private async nextWordNumber(): Promise<number> {
    let words = await WordModel.find().where("dictionary", this).select("number").sort("-number").limit(1);
    if (words.length > 0) {
      return words[0].number + 1;
    } else {
      return 1;
    }
  }

  private static async nextNumber(): Promise<number> {
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
    let updatedDate = raw.updatedDate?.toISOString() ?? undefined;
    let skeleton = DictionarySkeleton.of({id, number, paramName, name, status, secret, explanation, updatedDate});
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
        if (raw.user && isDocument(raw.user)) {
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