//

import {
  DocumentType,
  Ref,
  getModelForClass,
  index,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import {RETENTION_PERIODS} from "/server/model/constant";
import {DictionarySchema} from "/server/model/dictionary/dictionary";
import {UserSchema} from "/server/model/user/user";
import {SectionSchema} from "/server/model/word/section";


@modelOptions({schemaOptions: {collection: "oldWords"}})
@index({"dictionary": 1, "number": 1, "updatedDate": -1})
@index({"deletedDate": 1}, {expireAfterSeconds: RETENTION_PERIODS.oldData})
export class OldWordSchema {

  @prop({required: true, ref: "DictionarySchema"})
  public dictionary!: Ref<DictionarySchema>;

  @prop({required: true})
  public number!: number;

  @prop({required: true})
  public name!: string;

  @prop()
  public pronunciation?: string;

  @prop({required: true, type: String})
  public tags!: Array<string>;

  @prop({required: true, type: SectionSchema})
  public sections!: Array<SectionSchema>;

  @prop({ref: "UserSchema"})
  public updatedUser?: Ref<UserSchema>;

  @prop()
  public createdDate?: Date;

  @prop()
  public updatedDate?: Date;

  @prop({required: true})
  public deletedDate!: Date;

}


export type OldWord = DocumentType<OldWordSchema>;
export const OldWordModel = getModelForClass(OldWordSchema);
