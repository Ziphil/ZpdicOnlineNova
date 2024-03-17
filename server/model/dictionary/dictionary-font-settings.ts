//

import {getDiscriminatorModelForClass, getModelForClass, modelOptions, prop} from "@typegoose/typegoose";


@modelOptions({schemaOptions: {discriminatorKey: "type"}})
export class DictionaryFontSettingsSchema {

  @prop({required: true})
  public type!: string;

}


export class DictionaryFontLocalSettingsSchema extends DictionaryFontSettingsSchema {

  @prop({required: true})
  public name!: string;

}


export class DictionaryFontCustomSettingsSchema extends DictionaryFontSettingsSchema {

}


export const DictionaryFontSettingsModel = getModelForClass(DictionaryFontSettingsSchema);
export const DictionaryFontLocalSettingsModel = getDiscriminatorModelForClass(DictionaryFontSettingsModel, DictionaryFontLocalSettingsSchema, "local");
export const DictionaryFontCustomSettingsModel = getDiscriminatorModelForClass(DictionaryFontSettingsModel, DictionaryFontCustomSettingsSchema, "custom");