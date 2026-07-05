//

import {
  DocumentType,
  Ref,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import {DictionarySchema} from "/server/model/dictionary/dictionary";
import {LinkedExampleOfferSchema} from "/server/model/example-offer/linked-example-offer";
import {User} from "/server/model/user/user";
import {LinkedWordSchema} from "/server/model/word/linked-word";
import {LogUtil} from "/server/util/log";


@modelOptions({schemaOptions: {collection: "oldExamples"}})
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
  public updatedUser?: Ref<User>;

  @prop()
  public createdDate?: Date;

  @prop()
  public updatedDate?: Date;

  @prop({required: true})
  public deletedDate!: Date;

  /** 古い用例履歴データを完全に削除します。
   * 論理削除ではなく物理削除を行うので、もとには戻せません。*/
  public static async discardOlds(duration: number): Promise<void> {
    const date = new Date(Date.now() - duration * 24 * 60 * 60 * 1000);
    const result = await OldExampleModel.deleteMany().lt("deletedDate", date);
    LogUtil.log("model/old-example/discardOld", {count: result.deletedCount});
  }

}


export type OldExample = DocumentType<OldExampleSchema>;
export const OldExampleModel = getModelForClass(OldExampleSchema);
