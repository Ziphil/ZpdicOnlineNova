//

import {getModelForClass, modelOptions, prop} from "@typegoose/typegoose";


@modelOptions({schemaOptions: {autoCreate: false, collection: "dictionaryDictionaryLimits"}})
export class DictionaryDictionaryLimitsSchema {

  @prop()
  public wordCount?: number;

  @prop()
  public exampleCount?: number;

  @prop()
  public articleCount?: number;

}


export type DictionaryDictionaryLimits = DictionaryDictionaryLimitsSchema;
export type ResolvedDictionaryDictionaryLimits = Required<DictionaryDictionaryLimitsSchema>;
export const DictionaryDictionaryLimitsModel = getModelForClass(DictionaryDictionaryLimitsSchema);
