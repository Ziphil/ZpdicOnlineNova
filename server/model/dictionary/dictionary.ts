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
  QueryCursor
} from "mongoose";
import {
  DetailedDictionary as DetailedDictionarySkeleton,
  Dictionary as DictionarySkeleton,
  DictionaryStatistics,
  EditableExample as EditableExampleSkeleton,
  EditableWord as EditableWordSkeleton,
  StringLengths,
  UserDictionary as UserDictionarySkeleton,
  WholeAverage,
  WordNameFrequencies,
  WordNameFrequency
} from "/client/skeleton/dictionary";
import {
  User as UserSkeleton
} from "/client/skeleton/user";
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
  DictionarySettings,
  DictionarySettingsCreator,
  DictionarySettingsModel,
  Example,
  ExampleModel,
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
    let editUsers = new Array<User>();
    let number = await DictionaryModel.fetchNextNumber();
    let status = "ready";
    let secret = false;
    let settings = DictionarySettingsModel.createDefault();
    let externalData = {};
    let createdDate = new Date();
    let updatedDate = new Date();
    let dictionary = new DictionaryModel({user, editUsers, number, name, status, secret, settings, externalData, createdDate, updatedDate});
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
    let settings = this.settings as any;
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
          LogUtil.log("dictionary/upload", Object.entries(process.memoryUsage()).map(([key, value]) => `${key.toLowerCase()}: ${Math.round(value / 1048576 * 100) / 100}`).join(" | "));
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
    await WordModel.updateManyDiscarded().where("dictionary", this);
    LogUtil.log("dictionary/upload", `start uploading | number: ${this.number}`);
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
  public async discard(this: Dictionary): Promise<void> {
    await InvitationModel.deleteMany({}).where("dictionary", this);
    await this.flagDiscarded();
  }

  public async fetchWordNames<N extends number>(this: Dictionary, numbers: Array<N>): Promise<Record<N, string | null>> {
    let promises = numbers.map((number) => {
      let query = WordModel.findOneExist().where("dictionary", this).where("number", number);
      let promise = query.exec().then((word) => [number, word?.name ?? null] as const);
      return promise;
    });
    let entries = await Promise.all(promises);
    let names = Object.fromEntries(entries) as any;
    return names;
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

  public async editWord(this: Dictionary, word: EditableWordSkeleton): Promise<Word> {
    if (this.status !== "saving") {
      let resultWord = await WordModel.edit(this, word);
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
      let word = await WordModel.discard(this, number);
      return word;
    } else {
      throw new CustomError("dictionarySaving");
    }
  }

  public async editExample(this: Dictionary, example: EditableExampleSkeleton): Promise<Example> {
    if (this.status !== "saving") {
      let resultExample = await ExampleModel.edit(this, example);
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
      let example = await ExampleModel.discard(this, number);
      return example;
    } else {
      throw new CustomError("dictionarySaving");
    }
  }

  // 与えられた検索パラメータを用いて辞書を検索し、ヒットした単語のリストとサジェストのリストを返します。
  public async search(this: Dictionary, parameter: WordParameter, range?: QueryRange): Promise<{words: WithSize<Word>, suggestions: Array<Suggestion>}> {
    let query = parameter.createQuery(this);
    let suggestionQuery = parameter.createSuggestionQuery(this);
    let wordPromise = QueryRange.restrictWithSize(query, range);
    let suggestionPromise = suggestionQuery?.then((suggestions) => suggestions.map((suggestion) => new Suggestion(suggestion.title, suggestion.word))) ?? Promise.resolve([]);
    let [words, suggestions] = await Promise.all([wordPromise, suggestionPromise]);
    return {words, suggestions};
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
    let count = await WordModel.findExist().where("dictionary", this).countDocuments();
    return count;
  }

  public async calcWordNameFrequencies(): Promise<WordNameFrequencies> {
    let query = WordModel.findExist().where("dictionary", this).select("name").lean().cursor();
    let wholeFrequency = {all: 0, word: 0};
    let charFrequencies = new Map<string, WordNameFrequency>();
    for await (let word of query) {
      let countedChars = new Set<string>();
      for (let char of word.name) {
        let frequency = charFrequencies.get(char) ?? {all: 0, word: 0};
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
    let frequencies = {whole: wholeFrequency, char: Array.from(charFrequencies.entries())};
    return frequencies;
  }

  public async calcStatistics(): Promise<DictionaryStatistics> {
    let wordQuery = WordModel.findExist().where("dictionary", this).select(["name", "equivalents", "informations"]).lean().cursor();
    let exampleQuery = ExampleModel.findExist().where("dictionary", this).select(["sentence"]).lean().cursor();
    let rawWordCount = 0;
    let wholeWordNameLengths = {kept: 0, nfd: 0, nfc: 0};
    let wholeEquivalentNameCount = 0;
    let wholeInformationCount = 0;
    let wholeInformationTextLengths = {kept: 0, nfd: 0, nfc: 0};
    let wholeExampleCount = 0;
    for await (let word of wordQuery) {
      rawWordCount ++;
      wholeWordNameLengths.kept += [...word.name].length;
      wholeWordNameLengths.nfd += [...word.name.normalize("NFD")].length;
      wholeWordNameLengths.nfc += [...word.name.normalize("NFC")].length;
      for (let equivalent of word.equivalents) {
        wholeEquivalentNameCount += equivalent.names.length;
      }
      for (let information of word.informations) {
        wholeInformationCount ++;
        wholeInformationTextLengths.kept += [...information.text].length;
        wholeInformationTextLengths.nfd += [...information.text.normalize("NFD")].length;
        wholeInformationTextLengths.nfc += [...information.text.normalize("NFC")].length;
      }
    }
    for await (let example of exampleQuery) {
      wholeExampleCount ++;
    }
    let calcWithRatio = function <V extends number | StringLengths>(value: V): WholeAverage<V> {
      if (typeof value === "number") {
        return {whole: value, average: value / rawWordCount} as any;
      } else {
        return {whole: value, average: {kept: value.kept / rawWordCount, nfd: value.nfd / rawWordCount, nfc: value.nfc / rawWordCount}} as any;
      }
    };
    let calcWordCount = function (rawWordCount: number): DictionaryStatistics["wordCount"] {
      let raw = rawWordCount;
      let tokipona = rawWordCount / 120;
      let logTokipona = (rawWordCount <= 0) ? null : Math.log10(rawWordCount / 120);
      let coverage = Math.log10(rawWordCount) * 20 + 20;
      return {raw, tokipona, logTokipona, coverage};
    };
    let wordCount = calcWordCount(rawWordCount);
    let wordNameLengths = calcWithRatio(wholeWordNameLengths);
    let equivalentNameCount = calcWithRatio(wholeEquivalentNameCount);
    let informationCount = calcWithRatio(wholeInformationCount);
    let informationTextLengths = calcWithRatio(wholeInformationTextLengths);
    let exampleCount = calcWithRatio(wholeExampleCount);
    return {wordCount, wordNameLengths, equivalentNameCount, informationCount, informationTextLengths, exampleCount};
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
      let promise = this.hasAuthority(user, authority).then((predicate) => (predicate) ? authority : null);
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

  public async discardAuthorizedUser(this: Dictionary, user: User): Promise<true> {
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
    let skeleton = {id, number, paramName, name, status, secret, explanation, settings, createdDate, updatedDate};
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
    let skeleton = {...base, wordSize, user};
    return skeleton;
  }

  public static async createUser(raw: Dictionary, rawUser: User): Promise<UserDictionarySkeleton> {
    let basePromise = DictionaryCreator.createDetailed(raw);
    let authoritiesPromise = raw.fetchAuthorities(rawUser);
    let [base, authorities] = await Promise.all([basePromise, authoritiesPromise]);
    let skeleton = {...base, authorities};
    return skeleton;
  }

}


export type Dictionary = DocumentType<DictionarySchema>;
export let DictionaryModel = getModelForClass(DictionarySchema);