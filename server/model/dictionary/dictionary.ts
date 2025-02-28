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
  DictionaryStatistics,
  EditableArticle,
  EditableExample,
  EditableWord,
  StringLengths,
  WholeAverage,
  WordNameFrequencies,
  WordNameFrequency
} from "/client/skeleton";
import {Article, ArticleModel} from "/server/model/article";
import {DiscardableSchema} from "/server/model/base";
import {Deserializer} from "/server/model/dictionary/deserializer";
import {DICTIONARY_AUTHORITIES, DictionaryAuthority, DictionaryAuthorityUtil, DictionaryFullAuthority} from "/server/model/dictionary/dictionary-authority";
import {DictionarySettings, DictionarySettingsModel, DictionarySettingsSchema} from "/server/model/dictionary/dictionary-settings";
import {Serializer} from "/server/model/dictionary/serializer";
import {DictionaryParameter} from "/server/model/dictionary-parameter/dictionary-parameter";
import {CustomError} from "/server/model/error";
import {Example, ExampleModel} from "/server/model/example/example";
import {ExampleParameter} from "/server/model/example-parameter/example-parameter";
import {InvitationModel} from "/server/model/invitation";
import {User, UserSchema} from "/server/model/user/user";
import {Relation} from "/server/model/word/relation";
import {Suggestion} from "/server/model/word/suggestion";
import {Word, WordModel} from "/server/model/word/word";
import {NormalWordParameter} from "/server/model/word-parameter/normal-word-parameter";
import {WordParameter} from "/server/model/word-parameter/word-parameter";
import {WithSize} from "/server/type/common";
import {LiteralType, LiteralUtilType} from "/server/util/literal-type";
import {LogUtil} from "/server/util/log";
import {QueryRange} from "/server/util/query";
import {IDENTIFIER_REGEXP} from "/server/util/validation";


export const DICTIONARY_STATUSES = ["ready", "saving", "error"] as const;
export type DictionaryStatus = LiteralType<typeof DICTIONARY_STATUSES>;
export const DictionaryStatusUtil = LiteralUtilType.create(DICTIONARY_STATUSES);

export const DICTIONARY_VISIBILITIES = ["public", "unlisted", "private"] as const;
export type DictionaryVisibility = LiteralType<typeof DICTIONARY_VISIBILITIES>;
export const DictionaryVisibilityUtil = LiteralUtilType.create(DICTIONARY_VISIBILITIES);


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

  @prop({required: true, enum: DICTIONARY_VISIBILITIES})
  public visibility!: DictionaryVisibility;

  @prop()
  public explanation?: string;

  @prop({required: true})
  public settings!: DictionarySettingsSchema;

  @prop()
  public createdDate?: Date;

  @prop()
  public updatedDate?: Date;

  public static async addEmpty(name: string, user: User): Promise<Dictionary> {
    const editUsers = new Array<User>();
    const number = await DictionaryModel.fetchNextNumber();
    const status = "ready";
    const visibility = "public";
    const settings = DictionarySettingsModel.createDefault();
    const externalData = {};
    const createdDate = new Date();
    const updatedDate = new Date();
    const dictionary = new DictionaryModel({user, editUsers, number, name, status, visibility, settings, externalData, createdDate, updatedDate});
    await dictionary.save();
    return dictionary;
  }

  public static async fetch(order: string, range?: QueryRange): Promise<WithSize<Dictionary>> {
    const sortArg = (order === "createdDate") ? "-createdDate -updatedDate -number" : "-updatedDate -number";
    const query = DictionaryModel.findExist().where("visibility", "public").sort(sortArg);
    const result = await QueryRange.restrictWithSize(query, range);
    return result;
  }

  public static async fetchOneByNumber(number: number): Promise<Dictionary | null> {
    const dictionary = await DictionaryModel.findOneExist().where("number", number);
    return dictionary;
  }

  public static async fetchOneByIdentifier(identifier: number | string): Promise<Dictionary | null> {
    const value = (typeof identifier === "number") ? identifier : (identifier.match(/^\d+$/)) ? +identifier : identifier;
    const key = (typeof value === "number") ? "number" : "paramName";
    const dictionary = await DictionaryModel.findOneExist().where(key, value);
    return dictionary;
  }

  /** 指定されたユーザーが指定された権限をもっている辞書を全て返します。
   * `me` にユーザーを指定すると、`me` が見ることのできる辞書のみを返します。
   * `me` に `null` を指定すると、ユーザーに関わらず全員が見ることのできる辞書のみを返します (公開範囲が限定公開以下のものは除外される)。
   * `me` に `undefined` を指定するか省略すると、公開範囲に関係なく全ての辞書を返します。*/
  public static async fetchByUser(user: User, authority: DictionaryAuthority, me: Pick<User, "id"> | "all" | null): Promise<Array<Dictionary>> {
    const rawQuery = (() => {
      if (authority === "own") {
        if (me === "all") {
          const query = DictionaryModel.findExist().where({"user": user});
          return query;
        } else {
          const query = DictionaryModel.findExist().where({"user": user}).or([{"visibility": "public"}, {"user": me}, {"editUsers": me}]);
          return query;
        }
      } else {
        if (me === "all") {
          const query = DictionaryModel.findExist().or([
            DictionaryModel.find({"user": user}).getFilter(),
            DictionaryModel.find({"editUsers": user}).getFilter()
          ]);
          return query;
        } else {
          const query = DictionaryModel.findExist().or([
            DictionaryModel.find({"user": user}).or([{"visibility": "public"}, {"user": me}, {"editUsers": me}]).getFilter(),
            DictionaryModel.find({"editUsers": user}).or([{"visibility": "public"}, {"user": me}, {"editUsers": me}]).getFilter()
          ]);
          return query;
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

  /** この辞書に登録されているデータを全て削除し、ファイルから読み込んだデータを代わりに保存します。
   * 辞書の内部データも、ファイルから読み込んだものに更新されます。
   * `deserializer` にはデシリアライズ開始前 (`start` メソッドを呼ぶ前) のデシリアライザを渡してください。 */
  public async upload(this: Dictionary, deserializer: Deserializer): Promise<Dictionary> {
    await this.startUpload();
    const settings = this.settings as any;
    await new Promise<Dictionary>((resolve, reject) => {
      const counts = {word: 0, example: 0};
      deserializer.on("words", (words) => {
        WordModel.insertMany(words).catch(reject);
        counts.word += words.length;
        LogUtil.log("model/dictionary/upload", {number: this.number, counts});
        LogUtil.log("model/dictionary/upload", Object.fromEntries(Object.entries(process.memoryUsage()).map(([key, value]) => [key.toLowerCase(), Math.round(value / 1048576 * 100) / 100])));
      });
      deserializer.on("examples", (examples) => {
        ExampleModel.insertMany(examples).catch(reject);;
        counts.example += examples.length;
        LogUtil.log("model/dictionary/upload", {number: this.number, counts});
        LogUtil.log("model/dictionary/upload", Object.fromEntries(Object.entries(process.memoryUsage()).map(([key, value]) => [key.toLowerCase(), Math.round(value / 1048576 * 100) / 100])));
      });
      deserializer.on("property", (key, value) => {
        if (value !== undefined) {
          this[key] = value;
        }
      });
      deserializer.on("settings", (key, value) => {
        if (value !== undefined) {
          settings[key] = value;
        }
      });
      deserializer.on("end", () => {
        this.status = "ready";
        this.settings = settings;
        resolve(this);
      });
      deserializer.on("error", (error) => {
        this.status = "error";
        LogUtil.error("model/dictionary/upload", null, error);
        reject(error);
      });
      deserializer.start();
    });
    await this.save();
    return this;
  }

  private async startUpload(this: Dictionary): Promise<void> {
    this.status = "saving";
    this.updatedDate = new Date();
    await this.save();
    await Promise.all([
      WordModel.deleteManyExist().where("dictionary", this),
      ExampleModel.deleteManyExist().where("dictionary", this)
    ]);
    LogUtil.log("model/dictionary/startUpload", {number: this.number});
  }

  /** この辞書に登録されているデータを JSON ファイルに出力します。
   * `serializer` にはシリアライズ開始前 (`start` メソッドを呼ぶ前) のシリアライザを渡してください。 */
  public async download(this: Dictionary, serializer: Serializer): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      serializer.on("end", () => {
        resolve();
      });
      serializer.on("error", (error) => {
        reject(error);
      });
      serializer.start();
    });
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

  public async changeVisibility(this: Dictionary, visibility: DictionaryVisibility): Promise<Dictionary> {
    this.visibility = visibility;
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

  public async editWord(this: Dictionary, word: EditableWord, user: User): Promise<Word> {
    if (this.status !== "saving") {
      const resultWord = await WordModel.edit(this, word, user);
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

  public async editExample(this: Dictionary, example: EditableExample, user: User): Promise<Example> {
    if (this.status !== "saving") {
      const resultExample = await ExampleModel.edit(this, example, user);
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

  public async editArticle(this: Dictionary, example: EditableArticle, user: User): Promise<Article> {
    if (this.status !== "saving") {
      const resultArticle = await ArticleModel.edit(this, example, user);
      this.status = "ready";
      this.updatedDate = new Date();
      await this.save();
      return resultArticle;
    } else {
      throw new CustomError("dictionarySaving");
    }
  }

  public async discardArticle(this: Dictionary, number: number): Promise<Article> {
    if (this.status !== "saving") {
      const example = await ArticleModel.discard(this, number);
      return example;
    } else {
      throw new CustomError("dictionarySaving");
    }
  }

  /** 与えられた検索パラメータを用いて辞書を検索し、ヒットした単語のリストとサジェストのリストを返します。*/
  public async searchWords(this: Dictionary, parameter: WordParameter, range?: QueryRange): Promise<{words: WithSize<Word>, suggestions: Array<Suggestion>}> {
    const query = parameter.createQuery(this);
    const suggestionQuery = parameter.createSuggestionQuery(this);
    const [words, suggestions] = await Promise.all([
      QueryRange.restrictWithSize(query, range),
      suggestionQuery?.then((suggestions) => suggestions.map((suggestion) => new Suggestion(suggestion.title, suggestion.word))) ?? Promise.resolve([])
    ]);
    return {words, suggestions};
  }

  public async searchRelationWords(this: Dictionary, pattern: string): Promise<Array<Word>> {
    const range = new QueryRange(0, 50);
    const exactParameter = new NormalWordParameter(pattern, "both", "exact", {mode: "unicode", direction: "ascending"}, {ignore: {case: true}, shuffleSeed: null, enableSuggestions: false});
    const partParameter = new NormalWordParameter(pattern, "both", "part", {mode: "unicode", direction: "ascending"}, {ignore: {case: true}, shuffleSeed: null, enableSuggestions: false});
    const exactQuery = exactParameter.createQuery(this);
    const partQuery = partParameter.createQuery(this);
    const [exactWords, partWords] = await Promise.all([
      QueryRange.restrict(exactQuery, range),
      QueryRange.restrict(partQuery, range)
    ]);
    const exactWordIds = new Set<number>(exactWords.map((word) => word.id));
    const words = [...exactWords, ...partWords.filter((word) => !exactWordIds.has(word.id))].slice(0, 50);
    return words;
  }

  public async searchExamples(this: Dictionary, parameter: ExampleParameter, range?: QueryRange): Promise<WithSize<Example>> {
    const query = parameter.createQuery(this);
    const examples = await QueryRange.restrictWithSize(query, range);
    return examples;
  }

  public async searchArticles(this: Dictionary, range?: QueryRange): Promise<WithSize<Article>> {
    const query = ArticleModel.findExist().where("dictionary", this).sort("-updatedDate");
    const examples = await QueryRange.restrictWithSize(query, range);
    return examples;
  }

  public async fetchOldWords(this: Dictionary, wordNumber: number, range?: QueryRange): Promise<WithSize<Word>> {
    const query = WordModel.where().ne("removedDate", undefined).where("dictionary", this).where("number", wordNumber).sort("-updatedDate");
    const words = await QueryRange.restrictWithSize(query, range);
    return words;
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

  public async countExamples(): Promise<number> {
    const count = await ExampleModel.findExist().where("dictionary", this).countDocuments();
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

  public async hasAuthority(this: Dictionary, user: User, authority: DictionaryAuthority | "none"): Promise<boolean> {
    if (authority === "none") {
      return true;
    } else {
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
  }

  public async fetchAuthorities(this: Dictionary, user: User): Promise<Array<DictionaryAuthority>> {
    const authorities = await Promise.all(DICTIONARY_AUTHORITIES.map(async (authority) => {
      const predicate = await this.hasAuthority(user, authority);
      return (predicate) ? authority : null;
    }));
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


export type Dictionary = DocumentType<DictionarySchema>;
export const DictionaryModel = getModelForClass(DictionarySchema);