//

import {
  DocumentType,
  Ref,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import {
  History as HistorySkeleton
} from "/client/skeleton/history";
import {
  Dictionary,
  DictionaryModel,
  DictionarySchema
} from "/server/model/dictionary";
import {
  LogUtil
} from "/server/util/log";
import {
  QueryRange
} from "/server/util/query";


@modelOptions({schemaOptions: {collection: "histories"}})
export class HistorySchema {

  @prop({required: true, ref: "DictionarySchema"})
  public dictionary!: Ref<DictionarySchema>;

  @prop({required: true})
  public date!: Date;

  @prop({require: true})
  public wordSize!: number;

  public static async findLatest(dictionary: Dictionary, from: Date): Promise<Array<History>> {
    let histories = await HistoryModel.find().where("dictionary", dictionary).gte("date", from);
    return histories;
  }

  public static async addAll(): Promise<number> {
    let size = await DictionaryModel.find({}).countDocuments();
    let pageSize = Math.floor((size - 1) / 100) + 1;
    for (let page = 0 ; page < pageSize ; page ++) {
      let range = new QueryRange(page * 100, 100);
      let query = DictionaryModel.find({});
      let dictionaries = await QueryRange.restrict(query, range);
      let promises = dictionaries.map((dictionary) => HistoryModel.create(dictionary));
      let histories = await Promise.all(promises);
      await HistoryModel.insertMany(histories);
      LogUtil.log("history/add-all", `saved: ${page * 100 + dictionaries.length}`);
    }
    return size;
  }

  public static async create(dictionary: Dictionary): Promise<History> {
    let history = new HistoryModel({});
    history.dictionary = dictionary;
    history.date = new Date();
    history.wordSize = await dictionary.countWords();
    return history;
  }

}


export class HistoryCreator {

  public static create(raw: History): HistorySkeleton {
    let id = raw.id;
    let date = raw.date.toISOString();
    let wordSize = raw.wordSize;
    let skeleton = HistorySkeleton.of({id, date, wordSize});
    return skeleton;
  }

}


export type History = DocumentType<HistorySchema>;
export let HistoryModel = getModelForClass(HistorySchema);