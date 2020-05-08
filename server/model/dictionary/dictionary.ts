//

import {
  DocumentType,
  Ref,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import {
  DocumentQuery
} from "mongoose";
import {
  DictionaryDeserializer,
  DictionarySerializer,
  Word,
  WordCreator,
  WordModel
} from "/server/model/dictionary";
import {
  CustomError
} from "/server/model/error";
import {
  NormalSearchParameter
} from "/server/model/search-parameter";
import {
  User,
  UserSchema
} from "/server/model/user";
import {
  IDENTIFIER_REGEXP
} from "/server/model/validation";
import {
  Dictionary as DictionarySkeleton,
  EditWord as EditWordSkeleton
} from "/server/skeleton/dictionary";
import {
  takeErrorLog,
  takeLog
} from "/server/util/misc";
import {
  QueryUtil
} from "/server/util/query";


@modelOptions({schemaOptions: {collection: "dictionaries"}})
export class DictionarySchema {

  @prop({required: true, ref: UserSchema})
  public user!: Ref<UserSchema>;

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

  public static async createEmpty(name: string, user: User): Promise<Dictionary> {
    let dictionary = new DictionaryModel({});
    dictionary.user = user;
    dictionary.number = await DictionaryModel.nextNumber();
    dictionary.name = name;
    dictionary.status = "ready";
    dictionary.secret = false;
    dictionary.explanation = "";
    dictionary.updatedDate = new Date();
    dictionary.externalData = {};
    await dictionary.save();
    return dictionary;
  }

  public static async findPublic(): Promise<Array<Dictionary>> {
    let dictionaries = await DictionaryModel.find().ne("secret", true).sort("-updatedDate -number").exec();
    return dictionaries;
  }

  public static async findOneByNumber(number: number): Promise<Dictionary | null> {
    let query = DictionaryModel.findOne().where("number", number);
    let dictionary = await query.exec();
    return dictionary;
  }

  public static async findOneByValue(value: number | string): Promise<Dictionary | null> {
    let key = (typeof value === "number") ? "number" : "paramName";
    let query = DictionaryModel.findOne().where(key, value);
    let dictionary = await query.exec();
    return dictionary;
  }

  public static async findByUser(user: User): Promise<Array<Dictionary>> {
    let dictionaries = await DictionaryModel.find().where("user", user).sort("-updatedDate -number").exec();
    return dictionaries;
  }

  // この辞書に登録されている単語データを全て削除し、ファイルから読み込んだデータを代わりに保存します。
  // 辞書の内部データも、ファイルから読み込んだものに更新されます。
  public async upload(this: Dictionary, path: string): Promise<Dictionary> {
    this.status = "saving";
    this.updatedDate = new Date();
    this.externalData = {};
    await this.save();
    await WordModel.deleteMany({}).where("dictionary", this).exec();
    let externalData = {} as any;
    let promise = new Promise<Dictionary>((resolve, reject) => {
      let stream = new DictionaryDeserializer(path);
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

  public async download(this: Dictionary, path: string): Promise<void> {
    let promise = new Promise<void>((resolve, reject) => {
      let stream = new DictionarySerializer(path, this);
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
    await WordModel.deleteMany({}).where("dictionary", this).exec();
    await this.remove();
  }

  public async changeParamName(this: Dictionary, paramName: string): Promise<Dictionary> {
    if (paramName !== "") {
      let formerDictionary = await DictionaryModel.findOne().where("paramName", paramName).exec();
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
    let countQuery = WordModel.count(finalQuery.getQuery());
    let restrictedQuery = QueryUtil.restrict(finalQuery, offset, size);
    let hitSize = await countQuery.exec();
    let hitWords = await restrictedQuery.exec();
    return {hitSize, hitWords};
  }

  public async countWords(): Promise<number> {
    let count = WordModel.count({}).where("dictionary", this).exec();
    return count;
  }

  private async nextWordNumber(): Promise<number> {
    let words = await WordModel.find().where("dictionary", this).select("number").sort("-number").limit(1).exec();
    if (words.length > 0) {
      return words[0].number + 1;
    } else {
      return 1;
    }
  }

  private static async nextNumber(): Promise<number> {
    let dictionaries = await DictionaryModel.find().select("number").sort("-number").limit(1).exec();
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
    let secret = raw.secret || false;
    let explanation = raw.explanation || "";
    let updatedDate = raw.updatedDate?.toISOString() || null;
    let skeleton = DictionarySkeleton.of({id, number, paramName, name, status, secret, explanation, updatedDate});
    return skeleton;
  }

  public static async fetch(raw: Dictionary, whole?: boolean): Promise<DictionarySkeleton> {
    let skeleton = DictionaryCreator.create(raw);
    let wordPromise = new Promise(async (resolve, reject) => {
      try {
        if (whole) {
          let rawWords = await raw.getWords();
          skeleton.words = rawWords.map(WordCreator.create);
          skeleton.wordSize = rawWords.length;
        } else {
          skeleton.wordSize = await raw.countWords();
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    });
    let userPromise = new Promise(async (resolve, reject) => {
      try {
        await raw.populate("user").execPopulate();
        if (raw.user && "name" in raw.user) {
          skeleton.userName = raw.user.name;
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    });
    await Promise.all([wordPromise, userPromise]);
    return skeleton;
  }

}


export type Dictionary = DocumentType<DictionarySchema>;
export let DictionaryModel = getModelForClass(DictionarySchema);