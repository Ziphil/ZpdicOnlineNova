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
  SlimeStream,
  SlimeWord,
  SlimeWordDocument,
  SlimeWordModel
} from "/server/model/dictionary/slime";
import {
  User,
  UserDocument
} from "/server/model/user";


export class SlimeDictionary extends Dictionary<SlimeWord> {

  @prop({required: true, unique: true})
  public number!: number;

  @prop({required: true})
  public status!: string;

  @prop({required: true})
  public name!: string;

  @prop({required: true, ref: User})
  public user!: Ref<User>;

  @prop()
  public updatedDate?: Date;

  @prop()
  public secret?: boolean;

  @prop()
  public externalData?: object;

  public static async createEmpty(name: string, user: UserDocument): Promise<SlimeDictionaryDocument> {
    let dictionary = new SlimeDictionaryModel({});
    dictionary.number = await SlimeDictionaryModel.nextNumber();
    dictionary.status = "ready";
    dictionary.name = name;
    dictionary.user = user;
    dictionary.updatedDate = new Date();
    dictionary.secret = false;
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
      let stream = new SlimeStream(path);
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

  public async getWords(): Promise<Array<SlimeWordDocument>> {
    let words = await SlimeWordModel.find().where("dictionary", this);
    return words;
  }

  protected createQuery(parameter: NormalSearchParameter): DocumentQuery<Array<SlimeWordDocument>, SlimeWordDocument> {
    let search = parameter.search;
    let mode = parameter.mode;
    let type = parameter.type;
    let outerThis = this;
    let createAuxiliaryQuery = function (innerMode: string, innerType: string): DocumentQuery<Array<SlimeWordDocument>, SlimeWordDocument> {
      let key = "";
      if (innerMode === "name") {
        key = "name";
      } else if (innerMode === "equivalent") {
        key = "equivalents.names";
      } else if (innerMode === "information") {
        key = "informations.text";
      }
      let escapedSearch = search.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
      let query = SlimeWordModel.find().where("dictionary", outerThis);
      if (innerType === "exact") {
        let modifiedSearch = new RegExp("^" + escapedSearch + "$");
        query = query.where(key, modifiedSearch);
      } else if (innerType === "prefix") {
        let modifiedSearch = new RegExp("^" + escapedSearch);
        query = query.where(key, modifiedSearch);
      } else if (type === "suffix") {
        let modifiedSearch = new RegExp(escapedSearch + "$");
        query = query.where(key, modifiedSearch);
      } else if (type === "part") {
        let modifiedSearch = new RegExp(escapedSearch);
        query = query.where(key, modifiedSearch);
      } else if (type === "regular") {
        let modifiedSearch = new RegExp(search);
        query = query.where(key, modifiedSearch);
      }
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
    finalQuery.sort("name");
    return finalQuery;
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


export class SlimeDictionarySkeleton {

  public id: string;
  public number: number;
  public status: string;
  public secret: boolean;
  public name: string;
  public words?: Array<SlimeWordDocument>;
  public wordSize?: number;

  public constructor(dictionary: SlimeDictionaryDocument) {
    this.id = dictionary.id;
    this.number = dictionary.number;
    this.status = dictionary.status;
    this.secret = dictionary.secret || false;
    this.name = dictionary.name;
  }

  public async fetch(dictionary: SlimeDictionaryDocument): Promise<void> {
    this.wordSize = await dictionary.countWords();
  }

  public async fetchWords(dictionary: SlimeDictionaryDocument): Promise<void> {
    this.words = await dictionary.getWords();
    this.wordSize = this.words.length;
  }

  public search(parameter: NormalSearchParameter): Array<SlimeWordDocument> {
    let hitWords = this.words?.filter((word) => {
      let search = parameter.search;
      let mode = parameter.mode;
      let type = parameter.type;
      let createTargets = function (innerMode: string): Array<string> {
        let targets = [];
        if (innerMode === "name") {
          targets.push(word.name);
        } else if (innerMode === "equivalent") {
          for (let equivalent of word.equivalents) {
            targets.push(...equivalent.names);
          }
        } else if (innerMode === "information") {
          for (let information of word.informations) {
            targets.push(information.text);
          }
        }
        return targets;
      };
      let createNeedle = function (innerType: string): RegExp {
        let escapedSearch = search.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
        let needle = /^$/;
        if (innerType === "exact") {
          needle = new RegExp("^" + escapedSearch + "$");
        } else if (innerType === "prefix") {
          needle = new RegExp("^" + escapedSearch);
        } else if (innerType === "suffix") {
          needle = new RegExp(escapedSearch + "$");
        } else if (innerType === "part") {
          needle = new RegExp(escapedSearch);
        } else if (innerType === "regular") {
          needle = new RegExp(search);
        }
        return needle;
      };
      let createPredicate = function (innerMode: string, innerType: string): boolean {
        let targets = createTargets(innerMode);
        let needle = createNeedle(innerType);
        let result = targets.some((target) => {
          return !!target.match(needle);
        });
        return result;
      };
      let finalPredicate = false;
      if (mode === "name") {
        finalPredicate = createPredicate("name", type);
      } else if (mode === "equivalent") {
        finalPredicate = createPredicate("equivalent", type);
      } else if (mode === "content") {
        let namePredicate = createPredicate("name", type);
        let equivalentPredicate = createPredicate("equivalent", type);
        let informationPredicate = createPredicate("information", type);
        finalPredicate = namePredicate || equivalentPredicate || informationPredicate;
      } else if (mode === "both") {
        let namePredicate = createPredicate("name", type);
        let equivalentPredicate = createPredicate("equivalent", type);
        finalPredicate = namePredicate || equivalentPredicate;
      }
      return finalPredicate;
    });
    if (hitWords === undefined) {
      hitWords = [];
    }
    return hitWords;
  }

}


export type SlimeDictionaryDocument = DocumentType<SlimeDictionary>;
export let SlimeDictionaryModel = getModelForClass(SlimeDictionary);