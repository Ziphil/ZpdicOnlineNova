//

import {
  DocumentType,
  Ref,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import {
  EditableExample as EditableExampleSkeleton,
  Example as ExampleSkeleton
} from "/client/skeleton/dictionary";
import {
  DiscardableSchema
} from "/server/model/base";
import {
  Dictionary,
  DictionarySchema,
  LinkedWordCreator,
  Word
} from "/server/model/dictionary";
import {
  LinkedWordSchema
} from "/server/model/dictionary/linked-word";
import {
  CustomError
} from "/server/model/error";
import {
  LogUtil
} from "/server/util/log";


@modelOptions({schemaOptions: {collection: "examples"}})
export class ExampleSchema extends DiscardableSchema {

  @prop({required: true, ref: "DictionarySchema"})
  public dictionary!: Ref<DictionarySchema>;

  @prop({required: true})
  public number!: number;

  @prop({required: true, type: LinkedWordSchema})
  public words!: Array<LinkedWordSchema>;

  @prop({required: true})
  public sentence!: string;

  @prop({required: true})
  public translation!: string;

  @prop()
  public createdDate?: Date;

  @prop()
  public updatedDate?: Date;

  public static async fetchByWord(word: Word): Promise<Array<Example>> {
    let query = ExampleModel.findExist().where("dictionary", word.dictionary).where("words.number", word.number).sort("-createdDate");
    let result = await query.exec();
    return result;
  }

  public static async edit(dictionary: Dictionary, example: EditableExampleSkeleton): Promise<Example> {
    let currentExample = await ExampleModel.findOneExist().where("dictionary", dictionary).where("number", example.number);
    let resultExample;
    if (currentExample) {
      resultExample = new ExampleModel(example);
      resultExample.dictionary = dictionary;
      resultExample.createdDate = currentExample.createdDate;
      resultExample.updatedDate = new Date();
      await currentExample.flagDiscarded();
      await resultExample.save();
    } else {
      if (example.number === undefined) {
        example.number = await this.fetchNextNumber(dictionary);
      }
      resultExample = new ExampleModel(example);
      resultExample.dictionary = dictionary;
      resultExample.createdDate = new Date();
      resultExample.updatedDate = new Date();
      await resultExample.save();
    }
    LogUtil.log("example/edit", `number: ${dictionary.number} | current: ${currentExample?.id} | result: ${resultExample.id}`);
    return resultExample;
  }

  public static async discard(dictionary: Dictionary, number: number): Promise<Example> {
    let example = await ExampleModel.findOneExist().where("dictionary", dictionary).where("number", number);
    if (example) {
      await example.flagDiscarded();
    } else {
      throw new CustomError("noSuchExampleNumber");
    }
    LogUtil.log("word/discard", `number: ${dictionary.number} | current: ${example.id}`);
    return example;
  }

  private static async fetchNextNumber(dictionary: Dictionary): Promise<number> {
    let examples = await ExampleModel.find().where("dictionary", dictionary).select("number").sort("-number").limit(1);
    if (examples.length > 0) {
      return examples[0].number + 1;
    } else {
      return 1;
    }
  }

}


export class ExampleCreator {

  public static create(raw: Example): ExampleSkeleton {
    let id = raw.id;
    let number = raw.number;
    let words = raw.words.map(LinkedWordCreator.create);
    let sentence = raw.sentence;
    let translation = raw.translation;
    let skeleton = {id, number, words, sentence, translation};
    return skeleton;
  }

}


export type Example = DocumentType<ExampleSchema>;
export let ExampleModel = getModelForClass(ExampleSchema);