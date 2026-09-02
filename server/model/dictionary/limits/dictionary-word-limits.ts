//

import {getModelForClass, modelOptions, prop} from "@typegoose/typegoose";


@modelOptions({schemaOptions: {autoCreate: false, collection: "dictionaryWordLimits"}})
export class DictionaryWordLimitsSchema {

  @prop()
  public size?: number;

  @prop()
  public spellingLength?: number;

  @prop()
  public pronunciationLength?: number;

  @prop()
  public tagCount?: number;

  @prop()
  public tagLength?: number;

  @prop()
  public sectionCount?: number;

  @prop()
  public equivalentCountPerSection?: number;

  @prop()
  public informationCountPerSection?: number;

  @prop()
  public phraseCountPerSection?: number;

  @prop()
  public variationCountPerSection?: number;

  @prop()
  public relationCountPerSection?: number;

  @prop()
  public informationTitleLength?: number;

  @prop()
  public informationTextLength?: number;

}


export type DictionaryWordLimits = DictionaryWordLimitsSchema;
export type ResolvedDictionaryWordLimits = Required<DictionaryWordLimitsSchema>;
export const DictionaryWordLimitsModel = getModelForClass(DictionaryWordLimitsSchema);
