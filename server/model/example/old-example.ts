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
import {LinkedExampleOfferSchema} from "/server/model/example-offer/linked-example-offer";
import {UserSchema} from "/server/model/user/user";
import {LinkedWordSchema} from "/server/model/word/linked-word";


@modelOptions({schemaOptions: {collection: "oldExamples"}})
@index({"dictionary": 1, "number": 1})
@index({"deletedDate": 1}, {expireAfterSeconds: RETENTION_PERIODS.oldData})
export class OldExampleSchema {

  @prop({required: true, ref: "DictionarySchema"})
  public dictionary!: Ref<DictionarySchema>;

  @prop({required: true})
  public number!: number;

  @prop({type: String})
  public tags?: Array<string>;

  @prop({required: true, type: LinkedWordSchema})
  public words!: Array<LinkedWordSchema>;

  @prop({required: true})
  public sentence!: string;

  @prop({required: true})
  public translation!: string;

  @prop()
  public supplement?: string;

  @prop()
  public offer?: LinkedExampleOfferSchema;

  @prop({ref: "UserSchema"})
  public updatedUser?: Ref<UserSchema>;

  @prop()
  public createdDate?: Date;

  @prop()
  public updatedDate?: Date;

  @prop({required: true})
  public deletedDate!: Date;

}


export type OldExample = DocumentType<OldExampleSchema>;
export const OldExampleModel = getModelForClass(OldExampleSchema);
