//

import {getModelForClass, modelOptions, prop} from "@typegoose/typegoose";


@modelOptions({schemaOptions: {autoCreate: false, collection: "dictionaryExampleLimits"}})
export class DictionaryExampleLimitsSchema {

  @prop()
  public size?: number;

  @prop()
  public sentenceLength?: number;

  @prop()
  public translationLength?: number;

  @prop()
  public supplementLength?: number;

  @prop()
  public tagCount?: number;

  @prop()
  public tagLength?: number;

  @prop()
  public wordCount?: number;

}


export type DictionaryExampleLimits = DictionaryExampleLimitsSchema;
export type ResolvedDictionaryExampleLimits = Required<DictionaryExampleLimitsSchema>;
export const DictionaryExampleLimitsModel = getModelForClass(DictionaryExampleLimitsSchema);
