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
  SlimeWord,
  SlimeWordDocument,
  SlimeWordModel
} from "/server/model/dictionary/slime";
import {
  User,
  UserDocument
} from "/server/model/user";
import {
  QueryUtil
} from "/server/util/query";


export class SlimeDictionary extends Dictionary<SlimeWord> {

  @prop({required: true, ref: User})
  public user!: Ref<User>;

  @prop({required: true, unique: true})
  public number!: number;

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

  public static async findOneByNumber(number: number, user?: UserDocument): Promise<SlimeDictionaryDocument | null> {
    let query = SlimeDictionaryModel.findOne().where("number", number);
    if (user) {
      query = query.where("user", user);
    }
    let dictionary = await query.exec();
    return dictionary;
  }

  public static async findByUser(user: UserDocument): Promise<Array<SlimeDictionaryDocument>> {
    let dictionaries = await SlimeDictionaryModel.find().where("user", user).exec();
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
    let nextExternalData = {} as any;
    let promise = new Promise<SlimeDictionaryDocument>((resolve, reject) => {
      let stream = new SlimeDeserializer(path);
      let count = 0;
      stream.on("word", (word) => {
        word.dictionary = this;
        word.save();
        if ((++ count) % 500 === 0) {
          console.log("Dictionary saving: " + count);
        }
      });
      stream.on("other", (key, data) => {
        nextExternalData[key] = data;
      });
      stream.on("end", () => {
        this.status = "ready";
        console.log("Dictionary saved: " + count);
        resolve(this);
      });
      stream.on("error", (error) => {
        this.status = "error";
        console.log("Error occurred in saving");
        console.error(error);
        resolve(this);
      });
    });
    await promise;
    this.externalData = nextExternalData;
    await this.save();
    return this;
  }

  public async removeWhole(this: SlimeDictionaryDocument): Promise<void> {
    await SlimeWordModel.deleteMany({}).where("dictionary", this).exec();
    await this.remove();
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