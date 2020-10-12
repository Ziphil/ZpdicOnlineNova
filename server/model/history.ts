//

import {
  DocumentType,
  Ref,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import {
  Dictionary,
  DictionarySchema
} from "/server/model/dictionary";


@modelOptions({schemaOptions: {collection: "histories"}})
export class HistorySchema {

  @prop({required: true, ref: "DictionarySchema"})
  public dictionary!: Ref<DictionarySchema>;

  @prop({required: true})
  public date!: Date;

  @prop({require: true})
  public wordSize!: number;

  public static async add(dictionary: Dictionary): Promise<History> {
    let history = new HistoryModel({});
    history.dictionary = dictionary;
    history.date = new Date();
    history.wordSize = await dictionary.countWords();
    return history;
  }

}


export type History = DocumentType<HistorySchema>;
export let HistoryModel = getModelForClass(HistorySchema);