//

import {getModelForClass, modelOptions, prop} from "@typegoose/typegoose";


@modelOptions({schemaOptions: {autoCreate: false, collection: "dictionaryDictionaryLimits"}})
export class DictionaryDictionaryLimitsSchema {

  @prop()
  public wordCountPerDictionary?: number;

  @prop()
  public exampleCountPerDictionary?: number;

  @prop()
  public articleCountPerDictionary?: number;

}


export type DictionaryDictionaryLimits = DictionaryDictionaryLimitsSchema;
export type ResolvedDictionaryDictionaryLimits = Required<DictionaryDictionaryLimitsSchema>;
export const DictionaryDictionaryLimitsModel = getModelForClass(DictionaryDictionaryLimitsSchema);
