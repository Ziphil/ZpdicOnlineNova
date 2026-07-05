//

import {
  DocumentType,
  Ref,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import type {DictionaryStatus, DictionaryVisibility} from "/server/model/dictionary/dictionary";
import {DictionarySettingsSchema} from "/server/model/dictionary/dictionary-settings";
import {UserSchema} from "/server/model/user/user";


@modelOptions({schemaOptions: {collection: "oldDictionaries", minimize: false}})
export class OldDictionarySchema {

  @prop({required: true, ref: "UserSchema"})
  public user!: Ref<UserSchema>;

  @prop({required: true})
  public number!: number;

  @prop()
  public paramName?: string;

  @prop({required: true})
  public name!: string;

  @prop({required: true})
  public status!: DictionaryStatus;

  @prop({required: true})
  public visibility!: DictionaryVisibility;

  @prop()
  public explanation?: string;

  @prop({required: true})
  public settings!: DictionarySettingsSchema;

  @prop()
  public createdDate?: Date;

  @prop()
  public updatedDate?: Date;

  @prop({required: true})
  public deletedDate!: Date;

}


export type OldDictionary = DocumentType<OldDictionarySchema>;
export const OldDictionaryModel = getModelForClass(OldDictionarySchema);
