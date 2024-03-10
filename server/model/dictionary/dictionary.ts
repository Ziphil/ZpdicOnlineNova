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
import type {
  DetailedDictionary as DetailedDictionarySkeleton,
  Dictionary as DictionarySkeleton,
  DictionaryStatistics,
  EditableExample as EditableExampleSkeleton,
  EditableWord as EditableWordSkeleton,
  StringLengths,
  UserDictionary as UserDictionarySkeleton,
  User as UserSkeleton,
  WholeAverage,
  WordNameFrequencies,
  WordNameFrequency
} from "/client/skeleton";
import {
  WithSize
} from "/server/controller/internal/type";
import {
  DiscardableSchema
} from "/server/model/base";
import {
  DICTIONARY_AUTHORITIES,
  Deserializer,
  DictionaryAuthority,
  DictionaryAuthorityUtil,
  DictionaryFullAuthority,
  DictionaryParameter,
  DictionarySettings,
  DictionarySettingsCreator,
  DictionarySettingsModel,
  Example,
  ExampleModel,
  Relation,
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
export const DictionaryStatusUtil = LiteralUtilType.create(DICTIONARY_STATUSES);


@modelOptions({schemaOptions: {collection: "dictionaries", minimize: false}})
export class DictionarySchema extends DiscardableSchema {

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

  @prop({required: true})
  public settings!: DictionarySettingsSchema;

  @prop({required: true, default: {}})
  public externalData!: object;

  @prop()
  public createdDate?: Date;

  @prop()
  public updatedDate?: Date;

  public static async addEmpty(name: string, user: User): Promise<Dictionary> {
    const editUsers = new Array<User>();
    const number = await DictionaryModel.fetchNextNumber();
    const status = "ready";
    const secret = false;
    const settings = DictionarySettingsModel.createDefault();
    const externalData = {};
    const createdDate = new Date();
    const updatedDate = new Date();
    const dictionary = new DictionaryModel({user, editUsers, number, name, status, secret, settings, externalData, createdDate, updatedDate});
    await dictionary.save();
    return dictionary;
  }

  public static async fetch(order: string, range?: QueryRange): Promise<WithSize<Dictionary>> {
    const sortArg = (order === "createdDate") ? "-createdDate -updatedDate -number" : "-updatedDate -number";
    const query = DictionaryModel.findExist().ne("secret", true).sort(sortArg);
    const result = await QueryRange.restrictWithSize(query, range);
    return result;
  }

  public static async fetchOneByNumber(number: number): Promise<Dictionary | null> {
    const dictionary = await DictionaryModel.findOneExist().where("number", number);
    return dictionary;
  }

  public static async fetchOneByValue(value: number | string): Promise<Dictionary | null> {
    const key = (typeof value === "number") ? "number" : "paramName";
    const dictionary = await DictionaryModel.findOneExist().where(key, value);
    return dictionary;
  }

  public static async fetchByUser(user: User, authority: DictionaryAuthority, includeSecret: boolean = true): Promise<Array<Dictionary>> {
    const ownQuery = DictionaryModel.findExist().where("user", user);
    const editQuery = DictionaryModel.findExist().where("editUsers", user);
    const rawQuery = (() => {
      if (authority === "own") {
        if (includeSecret) {
          return ownQuery;
        } else {
          return ownQuery.ne("secret", true);
        }
      } else {
        if (includeSecret) {
          return DictionaryModel.findExist().or([ownQuery.getFilter(), editQuery.getFilter()]);
        } else {
          return DictionaryModel.findExist().or([ownQuery.getFilter(), editQuery.getFilter()]).ne("secret", true);
        }
      }
    })();
    const query = rawQuery.sort("-updatedDate -number");
    const dictionaries = await query.exec();
    return dictionaries;
  }

  public static async search(parameter: DictionaryParameter, range?: QueryRange): Promise<WithSize<Dictionary>> {
    const query = parameter.createQuery();
    const dictionaries = await QueryRange.restrictWithSize(query, range);
    return dictionaries;
  }

  /** この辞書に登録されている単語データを全て削除し、ファイルから読み込んだデータを代わりに保存します。
   * 辞書の内部データも、ファイルから読み込んだものに更新されます。*/
  public async upload(this: Dictionary, path: string, originalPath: string): Promise<Dictionary> {
    await this.startUpload();
    const settings = this.settings as any;
    let externalData = {};
    const promise = new Promise<Dictionary>((resolve, reject) => {
      const stream = Deserializer.create(path, originalPath, this);
      if (stream !== null) {
        let count = 0;
        stream.on("words", (words) => {
          WordModel.insertMany(words);
          count += words.length;
          LogUtil.log("model/dictionary/upload", {number: this.number, uploadingCount: count});
          LogUtil.log("model/dictionary/upload", Object.fromEntries(Object.entries(process.memoryUsage()).map(([key, value]) => [key.toLowerCase(), Math.round(value / 1048576 * 100) / 100])));
        });
        stream.on("property", (key, value) => {
          if (value !== undefined) {
            this[key] = value;
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
          LogUtil.error("model/dictionary/upload", null, error);
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
    await WordModel.deleteManyExist().where("dictionary", this);
    LogUtil.log("model/dictionary/startUpload", {number: this.number});
  }

  public async download(this: Dictionary, path: string): Promise<void> {
    const promise = new Promise<void>((resolve, reject) => {
      const stream = Serializer.create(path, this);
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

  /** この辞書を削除 (削除フラグを付加) します。
   * 削除した辞書を後で削除する直前の状態に戻せるように、この辞書に属する単語データの削除は行いません。*/
  public async discard(this: Dictionary): Promise<void> {
    await InvitationModel.deleteMany({}).where("dictionary", this);
    await this.flagDiscarded();
  }

  public async fetchOneWordByNumber(this: Dictionary, number: number): Promise<Word | null> {
    const query = WordModel.findOneExist().where("dictionary", this).where("number", number);
    const word = await query.exec();
    return word;
  }

  public async fetchWordNames<N extends number>(this: Dictionary, numbers: Array<N>): Promise<Record<N, string | null>> {
    const promises = numbers.map((number) => {
      const query = WordModel.findOneExist().where("dictionary", this).where("number", number);
      const promise = query.exec().then((word) => [number, word?.name ?? null] as const);
      return promise;
    });
    const entries = await Promise.all(promises);
    const names = Object.fromEntries(entries) as any;
    return names;
  }

  public async checkDuplicateWordName(this: Dictionary, name: string, excludedWordNumber?: number): Promise<boolean> {
    let query = WordModel.findOneExist().where("dictionary", this).where("name", name);
    if (excludedWordNumber !== undefined) {
      query = query.ne("number", excludedWordNumber);
    }
    const word = await query.exec();
    return word !== null;
  }

  public async changeParamName(this: Dictionary, paramName: string): Promise<Dictionary> {
    if (paramName !== "") {
      const formerDictionary = await DictionaryModel.findOneExist().where("paramName", paramName);
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
    const anySettings = this.settings as any;
    for (const [key, value] of Object.entries(settings)) {
      if (value !== undefined) {
        anySettings[key] = value;
      }
    }
    await this.save();
    return this;
  }

  public async editWord(this: Dictionary, word: EditableWordSkeleton): Promise<Word> {
    if (this.status !== "saving") {
      const resultWord = await WordModel.edit(this, word);
      this.status = "ready";
      this.updatedDate = new Date();
      await this.save();
      return resultWord;
    } else {
      throw new CustomError("dictionarySaving");
    }
  }

  public async discardWord(this: Dictionary, number: number): Promise<Word> {
    if (this.status !== "saving") {
      const word = await WordModel.discard(this, number);
      return word;
    } else {
      throw new CustomError("dictionarySaving");
    }
  }

  public async addRelation(this: Dictionary, number: number, relation: Relation): Promise<Word | null> {
    if (this.status !== "saving") {
      const word = await WordModel.addRelation(this, number, relation);
      return word;
    } else {
      throw new CustomError("dictionarySaving");
    }
  }

  public async fetchOneExampleByNumber(this: Dictionary, number: number): Promise<Example | null> {
    const query = ExampleModel.findOneExist().where("dictionary", this).where("number", number);
    const example = await query.exec();
    return example;
  }

  public async editExample(this: Dictionary, example: EditableExampleSkeleton): Promise<Example> {
    if (this.status !== "saving") {
      const resultExample = await ExampleModel.edit(this, example);
      this.status = "ready";
      this.updatedDate = new Date();
      await this.save();
      return resultExample;
    } else {
      throw new CustomError("dictionarySaving");
    }
  }

  public async discardExample(this: Dictionary, number: number): Promise<Example> {
    if (this.status !== "saving") {
      const example = await ExampleModel.discard(this, number);
      return example;
    } else {
      throw new CustomError("dictionarySaving");
    }
  }

  /** 与えられた検索パラメータを用いて辞書を検索し、ヒットした単語のリストとサジェストのリストを返します。*/
  public async searchWord(this: Dictionary, parameter: WordParameter, range?: QueryRange): Promise<{words: WithSize<Word>, suggestions: Array<Suggestion>}> {
    const query = parameter.createQuery(this);
    const suggestionQuery = parameter.createSuggestionQuery(this);
    const wordPromise = QueryRange.restrictWithSize(query, range);
    const suggestionPromise = suggestionQuery?.then((suggestions) => suggestions.map((suggestion) => new Suggestion(suggestion.title, suggestion.word))) ?? Promise.resolve([]);
    const [words, suggestions] = await Promise.all([wordPromise, suggestionPromise]);
    return {words, suggestions};
  }

  public async suggestTitles(propertyName: string, pattern: string): Promise<Array<string>> {
    const key = (() => {
      if (propertyName === "equivalent") {
        return "equivalents.titles";
      } else if (propertyName === "tag") {
        return "tags";
      } else if (propertyName === "information") {
        return "informations.title";
      } else if (propertyName === "variation") {
        return "variations.title";
      } else if (propertyName === "relation") {
        return "relations.titles";
      } else {
        return "";
      }
    })();
    const titles = await WordModel.findExist().where("dictionary", this).distinct(key);
    const hitTitles = (() => {
      if (pattern !== "") {
        const fuse = new Fuse(titles, {threshold: 1, distance: 40});
        return fuse.search(pattern).map((result) => result.item);
      } else {
        return titles.filter((title) => title !== "");
      }
    })();
    return hitTitles;
  }

  public async countWords(): Promise<number> {
    const count = await WordModel.findExist().where("dictionary", this).countDocuments();
    return count;
  }

  public async calcWordNameFrequencies(): Promise<WordNameFrequencies> {
    const query = WordModel.findExist().where("dictionary", this).select("name").lean().cursor();
    const wholeFrequency = {all: 0, word: 0};
    const charFrequencies = new Map<string, WordNameFrequency>();
    for await (const word of query) {
      const countedChars = new Set<string>();
      for (const char of word.name) {
        const frequency = charFrequencies.get(char) ?? {all: 0, word: 0};
        if (!countedChars.has(char)) {
          frequency.word ++;
          countedChars.add(char);
        }
        frequency.all ++;
        wholeFrequency.all ++;
        charFrequencies.set(char, frequency);
      }
      wholeFrequency.word ++;
    }
    const frequencies = {whole: wholeFrequency, char: Array.from(charFrequencies.entries())};
    return frequencies;
  }

  public async calcStatistics(): Promise<DictionaryStatistics> {
    const wordQuery = WordModel.findExist().where("dictionary", this).select(["name", "equivalents", "informations"]).lean().cursor();
    const exampleQuery = ExampleModel.findExist().where("dictionary", this).select(["sentence"]).lean().cursor();
    let rawWordCount = 0;
    const wholeWordNameLengths = {kept: 0, nfd: 0, nfc: 0};
    let wholeEquivalentNameCount = 0;
    let wholeInformationCount = 0;
    const wholeInformationTextLengths = {kept: 0, nfd: 0, nfc: 0};
    let wholeExampleCount = 0;
    for await (const word of wordQuery) {
      rawWordCount ++;
      wholeWordNameLengths.kept += [...word.name].length;
      wholeWordNameLengths.nfd += [...word.name.normalize("NFD")].length;
      wholeWordNameLengths.nfc += [...word.name.normalize("NFC")].length;
      for (const equivalent of word.equivalents) {
        wholeEquivalentNameCount += equivalent.names.length;
      }
      for (const information of word.informations) {
        wholeInformationCount ++;
        wholeInformationTextLengths.kept += [...information.text].length;
        wholeInformationTextLengths.nfd += [...information.text.normalize("NFD")].length;
        wholeInformationTextLengths.nfc += [...information.text.normalize("NFC")].length;
      }
    }
    for await (const example of exampleQuery) {
      wholeExampleCount ++;
    }
    const calcWithRatio = function <V extends number | StringLengths>(value: V): WholeAverage<V> {
      if (typeof value === "number") {
        return {whole: value, average: value / rawWordCount} as any;
      } else {
        return {whole: value, average: {kept: value.kept / rawWordCount, nfd: value.nfd / rawWordCount, nfc: value.nfc / rawWordCount}} as any;
      }
    };
    const calcWordCount = function (rawWordCount: number): DictionaryStatistics["wordCount"] {
      const raw = rawWordCount;
      const tokipona = rawWordCount / 120;
      const logTokipona = (rawWordCount <= 0) ? null : Math.log10(rawWordCount / 120);
      const ctwi = (rawWordCount <= 0) ? null : (Math.log(rawWordCount) / Math.log(120)) * 120;
      const coverage = Math.log10(rawWordCount) * 20 + 20;
      return {raw, tokipona, logTokipona, ctwi, coverage};
    };
    const wordCount = calcWordCount(rawWordCount);
    const wordNameLengths = calcWithRatio(wholeWordNameLengths);
    const equivalentNameCount = calcWithRatio(wholeEquivalentNameCount);
    const informationCount = calcWithRatio(wholeInformationCount);
    const informationTextLengths = calcWithRatio(wholeInformationTextLengths);
    const exampleCount = calcWithRatio(wholeExampleCount);
    return {wordCount, wordNameLengths, equivalentNameCount, informationCount, informationTextLengths, exampleCount};
  }

  public async hasAuthority(this: Dictionary, user: User, authority: DictionaryAuthority): Promise<boolean> {
    await this.populate(["user", "editUsers"]);
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
    const promises = DICTIONARY_AUTHORITIES.map((authority) => {
      const promise = this.hasAuthority(user, authority).then((predicate) => (predicate) ? authority : null);
      return promise;
    });
    const authorities = await Promise.all(promises);
    const filteredAuthorities = authorities.filter(DictionaryAuthorityUtil.is, DictionaryAuthorityUtil);
    return filteredAuthorities;
  }

  public async fetchAuthorizedUsers(this: Dictionary, authority: DictionaryFullAuthority): Promise<Array<User>> {
    await this.populate(["user", "editUsers"]);
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

  public async discardAuthorizedUser(this: Dictionary, user: User): Promise<true> {
    await this.populate("editUsers");
    if (isDocumentArray(this.editUsers)) {
      const exist = this.editUsers.find((editUser) => editUser.id === user.id) !== undefined;
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

  private static async fetchNextNumber(): Promise<number> {
    const dictionaries = await DictionaryModel.find().select("number").sort("-number").limit(1);
    if (dictionaries.length > 0) {
      return dictionaries[0].number + 1;
    } else {
      return 1;
    }
  }

}


export class DictionaryCreator {

  public static create(raw: Dictionary): DictionarySkeleton {
    const id = raw.id;
    const number = raw.number;
    const paramName = raw.paramName;
    const name = raw.name;
    const status = raw.status;
    const secret = raw.secret;
    const explanation = raw.explanation;
    const settings = DictionarySettingsCreator.create(raw.settings);
    const createdDate = raw.createdDate?.toISOString() ?? undefined;
    const updatedDate = raw.updatedDate?.toISOString() ?? undefined;
    const skeleton = {id, number, paramName, name, status, secret, explanation, settings, createdDate, updatedDate};
    return skeleton;
  }

  public static async createDetailed(raw: Dictionary): Promise<DetailedDictionarySkeleton> {
    const base = DictionaryCreator.create(raw);
    const userPromise = new Promise<UserSkeleton>(async (resolve, reject) => {
      try {
        await raw.populate("user");
        if (isDocument(raw.user)) {
          const user = UserCreator.create(raw.user);
          resolve(user);
        } else {
          reject();
        }
      } catch (error) {
        reject(error);
      }
    });
    const [user] = await Promise.all([userPromise]);
    const skeleton = {...base, user};
    return skeleton;
  }

  public static async createUser(raw: Dictionary, rawUser: User): Promise<UserDictionarySkeleton> {
    const basePromise = DictionaryCreator.createDetailed(raw);
    const authoritiesPromise = raw.fetchAuthorities(rawUser);
    const [base, authorities] = await Promise.all([basePromise, authoritiesPromise]);
    const skeleton = {...base, authorities};
    return skeleton;
  }

}


export type Dictionary = DocumentType<DictionarySchema>;
export const DictionaryModel = getModelForClass(DictionarySchema);