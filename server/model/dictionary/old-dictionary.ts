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


/** 削除された辞書データを保管するスキーマです。
 * `DictionarySchema` と全く同じプロパティ構成に加え、削除された日時を表す `removedDate` を必須で持ちます。
 * 辞書データを論理削除する際は、`dictionaries` コレクションから削除した上で、同じ内容をこの `olddictionaries` コレクションに移動します。
 * 万が一削除した辞書を復元する必要が生じた場合に備えて `_id` を保持したまま移動するので、この辞書に属する単語データなどとの参照関係は維持されます。*/
@modelOptions({schemaOptions: {collection: "olddictionaries", minimize: false}})
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
  public removedDate!: Date;

}


export type OldDictionary = DocumentType<OldDictionarySchema>;
export const OldDictionaryModel = getModelForClass(OldDictionarySchema);
