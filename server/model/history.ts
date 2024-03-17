//

import {
  DocumentType,
  Ref,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import {Dictionary, DictionaryModel, DictionarySchema} from "/server/model/dictionary/dictionary";
import {LogUtil} from "/server/util/log";
import {QueryRange} from "/server/util/query";


@modelOptions({schemaOptions: {collection: "histories"}})
export class HistorySchema {

  @prop({required: true, ref: "DictionarySchema"})
  public dictionary!: Ref<DictionarySchema>;

  @prop({required: true})
  public date!: Date;

  @prop({require: true})
  public wordSize!: number;

  public static async fetch(dictionary: Dictionary, from: Date): Promise<Array<History>> {
    const anyFrom = from as any;
    const histories = await HistoryModel.find().where("dictionary", dictionary).gte("date", anyFrom).sort("-date");
    return histories;
  }

  public static async addAll(): Promise<number> {
    const size = await DictionaryModel.find().countDocuments();
    const pageSize = Math.floor((size - 1) / 100) + 1;
    for (let page = 0 ; page < pageSize ; page ++) {
      const range = new QueryRange(page * 100, 100);
      const query = DictionaryModel.find();
      const dictionaries = await QueryRange.restrict(query, range);
      const promises = dictionaries.map((dictionary) => HistoryModel.build(dictionary));
      const histories = await Promise.all(promises);
      await HistoryModel.insertMany(histories);
      LogUtil.log("model/history/addAll", {savingCount: page * 100 + dictionaries.length});
    }
    return size;
  }

  public static async build(dictionary: Dictionary): Promise<History> {
    const date = new Date();
    const wordSize = await dictionary.countWords();
    const history = new HistoryModel({dictionary, date, wordSize});
    return history;
  }

}


export type History = DocumentType<HistorySchema>;
export const HistoryModel = getModelForClass(HistorySchema);