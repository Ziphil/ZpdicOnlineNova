/* eslint-disable @typescript-eslint/naming-convention */

import {
  DocumentType,
  Ref,
  getModelForClass,
  index,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import {Jsonify} from "jsonify-type";
import {DICTIONARY_LIMITS} from "/server/model/constant";
import {Dictionary, DictionarySchema} from "/server/model/dictionary/dictionary";
import {ResolvedDictionaryExampleLimits} from "/server/model/dictionary/limits/dictionary-example-limits";
import {CustomError} from "/server/model/error";
import {OldExampleModel} from "/server/model/example/old-example";
import {User, UserSchema} from "/server/model/user/user";
import {LinkedWordSchema} from "/server/model/word/linked-word";
import {Word, WordModel} from "/server/model/word/word";
import {LogUtil} from "/server/util/log";
import {WithSize} from "/server/util/query";
import {QueryRange} from "/server/util/query";
import {calcDataSize, createMaxCountValidator} from "/server/util/validation";
import {LinkedExampleOfferSchema} from "../example-offer/linked-example-offer";


@modelOptions({schemaOptions: {collection: "examples"}})
@index({"dictionary": 1, "number": 1})
@index({"dictionary": 1, "createdDate": -1, "number": -1, "_id": -1})
@index({"dictionary": 1, "words.number": 1})
@index({"offer.catalog": 1, "offer.number": 1})
export class ExampleSchema {

  @prop({required: true, ref: "DictionarySchema"})
  public dictionary!: Ref<DictionarySchema>;

  @prop({required: true})
  public number!: number;

  @prop({type: String, innerOptions: {maxlength: DICTIONARY_LIMITS.example.tagLength}, outerOptions: {validate: createMaxCountValidator(DICTIONARY_LIMITS.example.tagCount)}})
  public tags?: Array<string>;

  @prop({required: true, type: LinkedWordSchema, outerOptions: {validate: createMaxCountValidator(DICTIONARY_LIMITS.example.wordCount)}})
  public words!: Array<LinkedWordSchema>;

  @prop({required: true, maxlength: DICTIONARY_LIMITS.example.sentenceLength})
  public sentence!: string;

  @prop({required: true, maxlength: DICTIONARY_LIMITS.example.translationLength})
  public translation!: string;

  @prop({maxlength: DICTIONARY_LIMITS.example.supplementLength})
  public supplement?: string;

  @prop()
  public offer?: LinkedExampleOfferSchema;

  @prop({ref: "UserSchema"})
  public updatedUser?: Ref<UserSchema>;

  @prop()
  public createdDate?: Date;

  @prop()
  public updatedDate?: Date;

  public static async fetchByDictionary(dictionary: Dictionary, range?: QueryRange): Promise<WithSize<Example>> {
    const query = ExampleModel.find().where("dictionary", dictionary).sort("-createdDate -number");
    const result = await QueryRange.restrictWithSize(query, range);
    return result;
  }

  public static async fetchByWord(word: Word): Promise<Array<Example>> {
    const query = ExampleModel.find().where("dictionary", word.dictionary).where("words.number", word.number).sort("-createdDate -number");
    const result = await query.exec();
    return result;
  }

  public static async fetchByOffer(dictionary: Dictionary | null, offer: {catalog: string, number: number}, range?: QueryRange): Promise<WithSize<Example>> {
    if (dictionary !== null) {
      const query = ExampleModel.find().where("dictionary", dictionary).where("offer.catalog", offer.catalog).where("offer.number", offer.number).sort("-createdDate -number");
      const result = await QueryRange.restrictWithSize(query, range);
      return result;
    } else {
      console.log(dictionary, offer, range);
      const aggregate = ExampleModel.aggregate().match({"offer.catalog": offer.catalog, "offer.number": offer.number}).lookup({
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
    const limits = dictionary.limits.resolve().example;
    const currentExample = await ExampleModel.findOne().where("dictionary", dictionary).where("number", example.number);
    let resultExample;
    if (currentExample) {
      resultExample = new ExampleModel(example);
      resultExample.dictionary = dictionary;
      resultExample.updatedUser = user;
      resultExample.createdDate = currentExample.createdDate;
      resultExample.updatedDate = new Date();
      await this.filterWords(dictionary, resultExample);
      await resultExample.assertLimits(limits);
      await currentExample.deleteOneSoftly();
      await resultExample.save();
    } else {
      await dictionary.assertExampleCountLimits();
      if (example.number === null) {
        example.number = await dictionary.issueNextNumber("example");
      } else {
        await dictionary.raiseMaxNumber("example", example.number);
      }
      resultExample = new ExampleModel(example);
      resultExample.dictionary = dictionary;
      resultExample.updatedUser = user;
      resultExample.createdDate = new Date();
      resultExample.updatedDate = new Date();
      await this.filterWords(dictionary, resultExample);
      await resultExample.assertLimits(limits);
      await resultExample.save();
    }
    LogUtil.log("model/example/edit", {number: dictionary.number, currentId: currentExample?.id, resultId: resultExample.id});
    return resultExample;
  }

  public static async discard(dictionary: Dictionary, number: number): Promise<Example> {
    const example = await ExampleModel.findOne().where("dictionary", dictionary).where("number", number);
    if (example) {
      await example.deleteOneSoftly();
    } else {
      throw new CustomError("noSuchExample");
    }
    LogUtil.log("model/example/discard", {number: dictionary.number, currentId: example.id});
    return example;
  }

  private static async filterWords(dictionary: Dictionary, example: Example): Promise<void> {
    const linkedNumbers = example.words.map((word) => word.number);
    const linkedWords = await WordModel.find().where("dictionary", dictionary).where("number", linkedNumbers);
    example.words = example.words.filter((word) => linkedWords.some((linkedWord) => linkedWord.number === word.number));
  }

  public async assertLimits(this: Example, limits: ResolvedDictionaryExampleLimits): Promise<void> {
    this.assertSizeLimits(limits);
    this.assertFieldLimits(limits);
    await this.assertSchema();
  }

  public assertSizeLimits(this: Example, limits: ResolvedDictionaryExampleLimits): void {
    if (calcDataSize(this.toObject({depopulate: true})) > limits.size) {
      throw new CustomError("exampleSizeExceeded");
    }
  }

  public assertFieldLimits(this: Example, limits: ResolvedDictionaryExampleLimits): void {
    const valid = (
      this.sentence.length <= limits.sentenceLength &&
      this.translation.length <= limits.translationLength &&
      (this.supplement ?? "").length <= limits.supplementLength &&
      (this.tags ?? []).length <= limits.tagCount &&
      (this.tags ?? []).every((tag) => tag.length <= limits.tagLength) &&
      this.words.length <= limits.wordCount
    );
    if (!valid) {
      throw new CustomError("invalidExample");
    }
  }

  public async assertSchema(this: Example): Promise<void> {
    try {
      await this.validate();
    } catch (error) {
      if (error instanceof Error && error.name === "ValidationError") {
        throw new CustomError("invalidExample");
      } else {
        throw error;
      }
    }
  }

  /** この例文データを論理削除します。
   * 履歴データは上限の検査対象外とするため、履歴データの検証は行いません。*/
  public async deleteOneSoftly(this: Example): Promise<void> {
    const oldExample = new OldExampleModel(this.toObject({depopulate: true}));
    oldExample.deletedDate = new Date();
    await oldExample.save({validateBeforeSave: false});
    await ExampleModel.deleteOne().where("_id", this["_id"]);
  }

}


export type Example = DocumentType<ExampleSchema>;
export const ExampleModel = getModelForClass(ExampleSchema);

export type EditableExample = Pick<Jsonify<Example>, "tags" | "words" | "sentence" | "translation" | "supplement" | "offer"> & {number: number | null};