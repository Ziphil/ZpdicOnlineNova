//

import {
  DocumentType,
  Ref,
  getModelForClass,
  prop
} from "@hasezoey/typegoose";
import {
  DocumentQuery
} from "mongoose";
import {
  Dictionary
} from "/server/model/dictionary/dictionary";
import {
  NormalSearchParameter
} from "/server/model/dictionary/search-parameter";
import {
  SlimeDeserializer,
  SlimeSerializer,
  SlimeWord,
  SlimeWordDocument,
  SlimeWordModel
} from "/server/model/dictionary/slime";
import {
  CustomError
} from "/server/model/error";
import {
  User,
  UserDocument,
  UserModel
} from "/server/model/user";
import {
  IDENTIFIER_REGEXP
} from "/server/model/validation";
import {
  SlimeEditWordSkeleton
} from "/server/skeleton/dictionary/slime";
import {
  takeErrorLog,
  takeLog
} from "/server/util/misc";
import {
  QueryUtil
} from "/server/util/query";


export class SlimeDictionary extends Dictionary<SlimeWord> {

  @prop({required: true, ref: User})
  public user!: Ref<User>;

  @prop({required: true, unique: true})
  public number!: number;

  @prop({validate: IDENTIFIER_REGEXP})
  public paramName?: string;

  @prop({required: true})
  public name!: string;

  @prop({required: true})
  public status!: string;

  @prop()
  public secret?: boolean;

  @prop()
  public explanation?: string;

  @prop()
  public updatedDate?: Date;

  @prop()
  public externalData?: object;

  public static async createEmpty(name: string, user: UserDocument): Promise<SlimeDictionaryDocument> {
    let dictionary = new SlimeDictionaryModel({});
    dictionary.user = user;
    dictionary.number = await SlimeDictionaryModel.nextNumber();
    dictionary.name = name;
    dictionary.status = "ready";
    dictionary.secret = false;
    dictionary.explanation = "";
    dictionary.updatedDate = new Date();
    dictionary.externalData = {};
    await dictionary.save();
    return dictionary;
  }

  public static async findPublic(): Promise<Array<SlimeDictionaryDocument>> {
    let dictionaries = await SlimeDictionaryModel.find().ne("secret", true).sort("-updatedDate -number").exec();
    return dictionaries;
  }

  public static async findOneByNumber(number: number): Promise<SlimeDictionaryDocument | null> {
    let query = SlimeDictionaryModel.findOne().where("number", number);
    let dictionary = await query.exec();
    return dictionary;
  }

  public static async findOneByValue(value: number | string): Promise<SlimeDictionaryDocument | null> {
    let key = (typeof value === "number") ? "number" : "paramName";
    let query = SlimeDictionaryModel.findOne().where(key, value);
    let dictionary = await query.exec();
    return dictionary;
  }

  public static async findByUser(user: UserDocument): Promise<Array<SlimeDictionaryDocument>> {
    let dictionaries = await SlimeDictionaryModel.find().where("user", user).sort("-updatedDate -number").exec();
    return dictionaries;
  }

  // この辞書に登録されている単語データを全て削除し、ファイルから読み込んだデータを代わりに保存します。
  // 辞書の内部データも、ファイルから読み込んだものに更新されます。
  public async upload(this: SlimeDictionaryDocument, path: string): Promise<SlimeDictionaryDocument> {
    this.status = "saving";
    this.updatedDate = new Date();
    this.externalData = {};
    await this.save();
    await SlimeWordModel.deleteMany({}).where("dictionary", this).exec();
    let externalData = {} as any;
    let promise = new Promise<SlimeDictionaryDocument>((resolve, reject) => {
      let stream = new SlimeDeserializer(path);
      let count = 0;
      stream.on("word", (word) => {
        word.dictionary = this;
        word.save();
        if ((++ count) % 500 === 0) {
          takeLog("dictionary/upload", `uploading: ${count}`);
        }
      });
      stream.on("other", (key, data) => {
        externalData[key] = data;
      });
      stream.on("end", () => {
        this.status = "ready";
        takeLog("dictionary/upload", `uploaded: ${count}`);
        resolve(this);
      });
      stream.on("error", (error) => {
        this.status = "error";
        takeErrorLog("dictionary/upload", "error occurred in uploading", error);
        resolve(this);
      });
      stream.start();
    });
    await promise;
    this.externalData = externalData;
    await this.save();
    return this;
  }

  public async download(this: SlimeDictionaryDocument, path: string): Promise<void> {
    let promise = new Promise<void>((resolve, reject) => {
      let stream = new SlimeSerializer(path, this);
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

  public async removeWhole(this: SlimeDictionaryDocument): Promise<void> {
    await SlimeWordModel.deleteMany({}).where("dictionary", this).exec();
    await this.remove();
  }

  public async changeParamName(this: SlimeDictionaryDocument, paramName: string): Promise<SlimeDictionaryDocument> {
    if (paramName !== "") {
      let formerDictionary = await SlimeDictionaryModel.findOne().where("paramName", paramName).exec();
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

  public async changeName(this: SlimeDictionaryDocument, name: string): Promise<SlimeDictionaryDocument> {
    this.name = name;
    await this.save();
    return this;
  }

  public async changeSecret(this: SlimeDictionaryDocument, secret: boolean): Promise<SlimeDictionaryDocument> {
    this.secret = secret;
    await this.save();
    return this;
  }

  public async changeExplanation(this: SlimeDictionaryDocument, explanation: string): Promise<SlimeDictionaryDocument> {
    this.explanation = explanation;
    await this.save();
    return this;
  }

  public async getWords(): Promise<Array<SlimeWordDocument>> {
    let words = await SlimeWordModel.find().where("dictionary", this);
    return words;
  }

  public async getUser(): Promise<UserDocument> {
    let user = await UserModel.findOne().where(this.user);
    return user!;
  }

  public async editWord(this: SlimeDictionaryDocument, word: SlimeEditWordSkeleton): Promise<SlimeWordDocument> {
    let currentWord = await SlimeWordModel.findOne().where("dictionary", this).where("number", word.number);
    let resultWord;
    if (currentWord) {
      resultWord = new SlimeWordModel(word);
      resultWord.dictionary = this;
      await currentWord.remove();
      await resultWord.save();
    } else {
      if (word.number === undefined) {
        word.number = await this.nextWordNumber();
      }
      resultWord = new SlimeWordModel(word);
      resultWord.dictionary = this;
      await resultWord.save();
    }
    this.updatedDate = new Date();
    await this.save();
    takeLog("dictionary/edit-word", {currentWord, resultWord});
    return resultWord;
  }

  public async deleteWord(this: SlimeDictionaryDocument, number: number): Promise<SlimeWordDocument> {
    let word = await SlimeWordModel.findOne().where("dictionary", this).where("number", number);
    if (word) {
      await word.remove();
    } else {
      throw new CustomError("noSuchWordNumber");
    }
    takeLog("dictionary/delete-word", {word});
    return word;
  }

  public async search(parameter: NormalSearchParameter, offset?: number, size?: number): Promise<{hitSize: number, hitWords: Array<SlimeWordDocument>}> {
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
    let createAuxiliaryQuery = function (innerMode: string, innerType: string): DocumentQuery<Array<SlimeWordDocument>, SlimeWordDocument> {
      let key = createKey(innerMode);
      let needle = createNeedle(innerType);
      let query = SlimeWordModel.find().where("dictionary", outerThis).where(key, needle);
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
      finalQuery = SlimeWordModel.find().or([nameQuery.getQuery(), equivalentQuery.getQuery(), informationQuery.getQuery()]);
    } else if (mode === "both") {
      let nameQuery = createAuxiliaryQuery("name", type);
      let equivalentQuery = createAuxiliaryQuery("equivalent", type);
      finalQuery = SlimeWordModel.find().or([nameQuery.getQuery(), equivalentQuery.getQuery()]);
    } else {
      finalQuery = SlimeWordModel.find();
    }
    finalQuery = finalQuery.sort("name");
    let countQuery = SlimeWordModel.countDocuments(finalQuery.getQuery());
    let restrictedQuery = QueryUtil.restrict(finalQuery, offset, size);
    let hitSize = await countQuery.exec();
    let hitWords = await restrictedQuery.exec();
    return {hitSize, hitWords};
  }

  public async countWords(): Promise<number> {
    let count = SlimeWordModel.countDocuments().where("dictionary", this).exec();
    return count;
  }

  private async nextWordNumber(): Promise<number> {
    let words = await SlimeWordModel.find().where("dictionary", this).select("number").sort("-number").limit(1).exec();
    if (words.length > 0) {
      return words[0].number + 1;
    } else {
      return 1;
    }
  }

  private static async nextNumber(): Promise<number> {
    let dictionaries = await SlimeDictionaryModel.find().select("number").sort("-number").limit(1).exec();
    if (dictionaries.length > 0) {
      return dictionaries[0].number + 1;
    } else {
      return 1;
    }
  }

}


export type SlimeDictionaryDocument = DocumentType<SlimeDictionary>;
export let SlimeDictionaryModel = getModelForClass(SlimeDictionary);