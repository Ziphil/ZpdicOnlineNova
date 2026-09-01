//

import {getModelForClass, modelOptions, prop} from "@typegoose/typegoose";


@modelOptions({schemaOptions: {autoCreate: false, collection: "dictionaryMaxNumbers"}})
export class DictionaryMaxNumbersSchema {

  @prop({required: true})
  public word!: number;

  @prop({required: true})
  public example!: number;

  @prop({required: true})
  public article!: number;

  public static createDefault(): DictionaryMaxNumbers {
    const maxNumbers = new DictionaryMaxNumbersModel({
      word: 0,
      example: 0,
      article: 0
    });
    return maxNumbers;
  }

}


export type DictionaryMaxNumbers = DictionaryMaxNumbersSchema;
export const DictionaryMaxNumbersModel = getModelForClass(DictionaryMaxNumbersSchema);
