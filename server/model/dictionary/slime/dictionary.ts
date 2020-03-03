//

import {
  DocumentType,
  Ref,
  getModelForClass,
  prop
} from "@hasezoey/typegoose";
import {
  SlimeStream,
  SlimeWordDocument,
  SlimeWordModel
} from "/server/model/dictionary/slime";
import {
  User,
  UserDocument
} from "/server/model/user";


export class SlimeDictionary {

  @prop({required: true, unique: true})
  public number!: number;

  @prop({required: true})
  public status!: string;

  @prop({required: true})
  public name!: string;

  @prop({required: true, ref: User})
  public user!: Ref<User>;

  @prop({required: true})
  public externalData!: object;

  private static async nextNumber(): Promise<number> {
    let dictionaries = await SlimeDictionaryModel.find({}).select("number").sort({number: -1}).limit(1).exec();
    if (dictionaries.length > 0) {
      return dictionaries[0].number + 1;
    } else {
      return 1;
    }
  }

  public static async registerUpload(name: string, user: Ref<User>, path: string): Promise<SlimeDictionaryDocument> {
    let dictionary = new SlimeDictionaryModel({});
    dictionary.number = await SlimeDictionaryModel.nextNumber();
    dictionary.name = name;
    dictionary.user = user;
    await dictionary.upload(path);
    return dictionary;
  }

  public static async findByNumber(number: number): Promise<SlimeDictionaryDocument | null> {
    let dictionary = await SlimeDictionaryModel.findOne({number}).exec();
    return dictionary;
  }

  public static async findByUser(user: UserDocument): Promise<Array<SlimeDictionaryDocument>> {
    let dictionaries = await SlimeDictionaryModel.find({user}).exec();
    return dictionaries;
  }

  public async search(search: string, mode: string, type: string, offset: number, size: number): Promise<Array<SlimeWordDocument>> {
    let escapedSearch = search.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
    let wordPredicate = {dictionary: this} as any;
    let equivalentPredicate = {dictionary: this} as any;
    if (type === "prefix") {
      let modifiedSearch = new RegExp("^" + escapedSearch);
      wordPredicate["name"] = modifiedSearch;
      equivalentPredicate["equivalents.names"] = modifiedSearch;
    } else if (type === "regular") {
      wordPredicate["name"] = search;
      equivalentPredicate["equivalents.names"] = search;
    }
    let query = undefined as any;
    if (mode === "word") {
      query = SlimeWordModel.find(wordPredicate);
    } else if (mode === "equivalent") {
      query = SlimeWordModel.find(equivalentPredicate);
    } else if (mode === "both") {
      query = SlimeWordModel.find().or([wordPredicate, equivalentPredicate]);
    }
    let words = [];
    if (query !== undefined) {
      if (size) {
        words = await query.skip(offset).limit(size).exec();
      } else {
        words = await query.skip(offset).exec();
      }
    }
    return words;
  }

  public async countWords(this: SlimeDictionaryDocument): Promise<number> {
    let count = SlimeWordModel.countDocuments({dictionary: this}).exec();
    return count;
  }

  // この辞書に登録されている単語データを全て削除し、ファイルから読み込んだデータを代わりに保存します。
  // 辞書の内部データも、ファイルから読み込んだものに更新されます。
  public async upload(this: SlimeDictionaryDocument, path: string): Promise<SlimeDictionaryDocument> {
    this.status = "saving";
    this.externalData = {};
    await this.save();
    await SlimeWordModel.deleteMany({dictionary: this}).exec();
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
      stream.on("wordEnd", () => {
        this.status = "ready";
        this.save();
        console.log("Dictionary saved: " + count);
        resolve(this);
      });
    });
    return await promise;
  }

}


export class SlimeDictionarySkeleton {

  public id: string;
  public number: number;
  public status: string;
  public name: string;
  public wordSize?: number;

  public constructor(dictionary: SlimeDictionaryDocument) {
    this.id = dictionary.id;
    this.number = dictionary.number;
    this.status = dictionary.status;
    this.name = dictionary.name;
  }

  public async fetch(dictionary: SlimeDictionaryDocument): Promise<void> {
    this.wordSize = await dictionary.countWords();
  }

}


export type SlimeDictionaryDocument = DocumentType<SlimeDictionary>;
export let SlimeDictionaryModel = getModelForClass(SlimeDictionary);