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
  DictionaryDeserializer,
  DictionarySerializer,
  WordDocument,
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
  UserDocument
} from "/server/model/user";
import {
  IDENTIFIER_REGEXP
} from "/server/model/validation";
import {
  EditWordSkeleton
} from "/server/skeleton/dictionary";
import {
  takeErrorLog,
  takeLog
} from "/server/util/misc";
import {
  QueryUtil
} from "/server/util/query";


export class Dictionary {

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

  public static async createEmpty(name: string, user: UserDocument): Promise<DictionaryDocument> {
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

  public static async findPublic(): Promise<Array<DictionaryDocument>> {
    let dictionaries = await DictionaryModel.find().ne("secret", true).sort("-updatedDate -number").exec();
    return dictionaries;
  }

  public static async findOneByNumber(number: number): Promise<DictionaryDocument | null> {
    let query = DictionaryModel.findOne().where("number", number);
    let dictionary = await query.exec();
    return dictionary;
  }

  public static async findOneByValue(value: number | string): Promise<DictionaryDocument | null> {
    let key = (typeof value === "number") ? "number" : "paramName";
    let query = DictionaryModel.findOne().where(key, value);
    let dictionary = await query.exec();
    return dictionary;
  }

  public static async findByUser(user: UserDocument): Promise<Array<DictionaryDocument>> {
    let dictionaries = await DictionaryModel.find().where("user", user).sort("-updatedDate -number").exec();
    return dictionaries;
  }

  // この辞書に登録されている単語データを全て削除し、ファイルから読み込んだデータを代わりに保存します。
  // 辞書の内部データも、ファイルから読み込んだものに更新されます。
  public async upload(this: DictionaryDocument, path: string): Promise<DictionaryDocument> {
    this.status = "saving";
    this.updatedDate = new Date();
    this.externalData = {};
    await this.save();
    await WordModel.deleteMany({}).where("dictionary", this).exec();
    let externalData = {} as any;
    let promise = new Promise<DictionaryDocument>((resolve, reject) => {
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

  public async download(this: DictionaryDocument, path: string): Promise<void> {
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

  public async removeWhole(this: DictionaryDocument): Promise<void> {
    await WordModel.deleteMany({}).where("dictionary", this).exec();
    await this.remove();
  }

  public async changeParamName(this: DictionaryDocument, paramName: string): Promise<DictionaryDocument> {
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

  public async changeName(this: DictionaryDocument, name: string): Promise<DictionaryDocument> {
    this.name = name;
    await this.save();
    return this;
  }

  public async changeSecret(this: DictionaryDocument, secret: boolean): Promise<DictionaryDocument> {
    this.secret = secret;
    await this.save();
    return this;
  }

  public async changeExplanation(this: DictionaryDocument, explanation: string): Promise<DictionaryDocument> {
    this.explanation = explanation;
    await this.save();
    return this;
  }

  public async getWords(): Promise<Array<WordDocument>> {
    let words = await WordModel.find().where("dictionary", this);
    return words;
  }

  // この辞書に登録されている単語を編集します。
  // 渡された単語データと番号が同じ単語データがすでに存在する場合は、渡された単語データでそれを上書きします。
  // そうでない場合は、渡された単語データを新しいデータとして追加します。
  // 番号によってデータの修正か新規作成かを判断するので、既存の単語データの番号を変更する編集はできません。
  public async editWord(this: DictionaryDocument, word: EditWordSkeleton): Promise<WordDocument> {
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

  public async deleteWord(this: DictionaryDocument, number: number): Promise<WordDocument> {
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

  private async correctRelationsByEdit(word: WordDocument): Promise<void> {
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

  private async correctRelationsByDelete(word: WordDocument): Promise<void> {
    let affectedWords = await WordModel.find().where("dictionary", this).where("relations.number", word.number);
    for (let affectedWord of affectedWords) {
      affectedWord.relations = affectedWord.relations.filter((relation) => relation.number !== word.number);
    }
    let promises = affectedWords.map((affectedWord) => affectedWord.save());
    await Promise.all(promises);
  }

  public async search(parameter: NormalSearchParameter, offset?: number, size?: number): Promise<{hitSize: number, hitWords: Array<WordDocument>}> {
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
    let createAuxiliaryQuery = function (innerMode: string, innerType: string): DocumentQuery<Array<WordDocument>, WordDocument> {
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
    let count = WordModel.countDocuments().where("dictionary", this).exec();
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


export type DictionaryDocument = DocumentType<Dictionary>;
export let DictionaryModel = getModelForClass(Dictionary);