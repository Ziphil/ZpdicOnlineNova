//

import {getModelForClass, modelOptions, prop} from "@typegoose/typegoose";


@modelOptions({schemaOptions: {autoCreate: false, collection: "dictionaryArticleLimits"}})
export class DictionaryArticleLimitsSchema {

  @prop()
  public size?: number;

  @prop()
  public titleLength?: number;

  @prop()
  public contentLength?: number;

  @prop()
  public tagCount?: number;

  @prop()
  public tagLength?: number;

}


export type DictionaryArticleLimits = DictionaryArticleLimitsSchema;
export type ResolvedDictionaryArticleLimits = Required<DictionaryArticleLimitsSchema>;
export const DictionaryArticleLimitsModel = getModelForClass(DictionaryArticleLimitsSchema);
