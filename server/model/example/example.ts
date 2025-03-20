/* eslint-disable @typescript-eslint/naming-convention */

import {
  DocumentType,
  Ref,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import type {EditableExample} from "/client/skeleton";
import {DiscardableSchema} from "/server/model/base";
import {Dictionary, DictionarySchema} from "/server/model/dictionary/dictionary";
import {CustomError} from "/server/model/error";
import {LinkedExampleOfferSchema} from "/server/model/example/linked-example-offer";
import {User} from "/server/model/user/user";
import {LinkedWordSchema} from "/server/model/word/linked-word";
import {Word, WordModel} from "/server/model/word/word";
import {WithSize} from "/server/type/common";
import {LogUtil} from "/server/util/log";
import {QueryRange} from "/server/util/query";


@modelOptions({schemaOptions: {collection: "examples"}})
export class ExampleSchema extends DiscardableSchema {

  @prop({required: true, ref: "DictionarySchema"})
  public dictionary!: Ref<DictionarySchema>;

  @prop({required: true})
  public number!: number;

  @prop({type: String})
  public tags?: Array<string>;

  @prop({required: true, type: LinkedWordSchema})
  public words!: Array<LinkedWordSchema>;

  @prop({required: true})
  public sentence!: string;

  @prop({required: true})
  public translation!: string;

  @prop()
  public supplement?: string;

  @prop()
  public offer?: LinkedExampleOfferSchema;

  @prop({ref: "UserSchema"})
  public updatedUser?: Ref<User>;

  @prop()
  public createdDate?: Date;

  @prop()
  public updatedDate?: Date;

  public static async fetchByDictionary(dictionary: Dictionary, range?: QueryRange): Promise<WithSize<Example>> {
    const query = ExampleModel.findExist().where("dictionary", dictionary).sort("-createdDate -number");
    const result = await QueryRange.restrictWithSize(query, range);
    return result;
  }

  public static async fetchByWord(word: Word): Promise<Array<Example>> {
    const query = ExampleModel.findExist().where("dictionary", word.dictionary).where("words.number", word.number).sort("-createdDate -number");
    const result = await query.exec();
    return result;
  }

  public static async fetchByOffer(dictionary: Dictionary | null, offer: {catalog: string, number: number}, range?: QueryRange): Promise<WithSize<Example>> {
    if (dictionary !== null) {
      const query = ExampleModel.findExist().where("dictionary", dictionary).where("offer.catalog", offer.catalog).where("offer.number", offer.number).sort("-createdDate -number");
      const result = await QueryRange.restrictWithSize(query, range);
      return result;
    } else {
      const aggregate = ExampleModel.aggregateExist().match({"offer.catalog": offer.catalog, "offer.number": offer.number}).lookup({
        from: "dictionaries",
        localField: "dictionary",
        foreignField: "_id",
        as: "popluatedDictionary"
      }).unwind("$popluatedDictionary").match({"popluatedDictionary.visibility": "public"}).sort("-createdDate -number");
      const result = await QueryRange.restrictWithSize(aggregate, range);
      return result;
    }
  }

  public static async edit(dictionary: Dictionary, example: EditableExample, user: User): Promise<Example> {
    const currentExample = await ExampleModel.findOneExist().where("dictionary", dictionary).where("number", example.number);
    let resultExample;
    if (currentExample) {
      resultExample = new ExampleModel(example);
      resultExample.dictionary = dictionary;
      resultExample.updatedUser = user;
      resultExample.createdDate = currentExample.createdDate;
      resultExample.updatedDate = new Date();
      await this.filterWords(dictionary, resultExample);
      await currentExample.flagDiscarded();
      await resultExample.save();
    } else {
      if (example.number === null) {
        example.number = await this.fetchNextNumber(dictionary);
      }
      resultExample = new ExampleModel(example);
      resultExample.dictionary = dictionary;
      resultExample.updatedUser = user;
      resultExample.createdDate = new Date();
      resultExample.updatedDate = new Date();
      await this.filterWords(dictionary, resultExample);
      await resultExample.save();
    }
    LogUtil.log("model/example/edit", {number: dictionary.number, currentId: currentExample?.id, resultId: resultExample.id});
    return resultExample;
  }

  public static async discard(dictionary: Dictionary, number: number): Promise<Example> {
    const example = await ExampleModel.findOneExist().where("dictionary", dictionary).where("number", number);
    if (example) {
      await example.flagDiscarded();
    } else {
      throw new CustomError("noSuchExample");
    }
    LogUtil.log("model/example/discard", {number: dictionary.number, currentId: example.id});
    return example;
  }

  /** 古い履歴データを完全に削除します。
   * 論理削除ではなく物理削除を行うので、もとには戻せません。*/
  public static async discardOlds(duration: number): Promise<void> {
    const date = new Date(Date.now() - duration * 24 * 60 * 60 * 1000);
    const result = await ExampleModel.deleteMany().lt("removedDate", date);
    LogUtil.log("model/example/discardOld", {count: result.deletedCount});
  }

  private static async filterWords(dictionary: Dictionary, example: Example): Promise<void> {
    const linkedNumbers = example.words.map((word) => word.number);
    const linkedWords = await WordModel.findExist().where("dictionary", dictionary).where("number", linkedNumbers);
    example.words = example.words.filter((word) => linkedWords.some((linkedWord) => linkedWord.number === word.number));
  }

  private static async fetchNextNumber(dictionary: Dictionary): Promise<number> {
    const examples = await ExampleModel.find().where("dictionary", dictionary).select("number").sort("-number").limit(1);
    if (examples.length > 0) {
      return examples[0].number + 1;
    } else {
      return 1;
    }
  }

}


export type Example = DocumentType<ExampleSchema>;
export const ExampleModel = getModelForClass(ExampleSchema);