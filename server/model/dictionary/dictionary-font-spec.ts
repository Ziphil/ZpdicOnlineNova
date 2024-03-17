//

import {getDiscriminatorModelForClass, getModelForClass, modelOptions, prop} from "@typegoose/typegoose";


@modelOptions({schemaOptions: {discriminatorKey: "type"}})
export class DictionaryFontSpecSchema {

  @prop({required: true})
  public type!: string;

}


export class DictionaryFontLocalSpecSchema extends DictionaryFontSpecSchema {

  @prop({required: true})
  public name!: string;

}


export class DictionaryFontCustomSpecSchema extends DictionaryFontSpecSchema {

}


export const DictionaryFontSpecModel = getModelForClass(DictionaryFontSpecSchema);
export const DictionaryFontLocalSpecModel = getDiscriminatorModelForClass(DictionaryFontSpecModel, DictionaryFontLocalSpecSchema, "local");
export const DictionaryFontCustomSpecModel = getDiscriminatorModelForClass(DictionaryFontSpecModel, DictionaryFontCustomSpecSchema, "custom");