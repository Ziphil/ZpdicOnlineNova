//

import {
  DocumentType,
  Ref,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import {DictionarySchema} from "/server/model/dictionary/dictionary";
import {User} from "/server/model/user/user";
import {SectionSchema} from "/server/model/word/section";
import {LogUtil} from "/server/util/log";


@modelOptions({schemaOptions: {collection: "oldWords"}})
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
  public updatedUser?: Ref<User>;

  @prop()
  public createdDate?: Date;

  @prop()
  public updatedDate?: Date;

  @prop({required: true})
  public removedDate!: Date;

  /** 古い単語履歴データを完全に削除します。
   * 論理削除ではなく物理削除を行うので、もとには戻せません。*/
  public static async discardOlds(duration: number): Promise<void> {
    const date = new Date(Date.now() - duration * 24 * 60 * 60 * 1000);
    const result = await OldWordModel.deleteMany().lt("removedDate", date);
    LogUtil.log("model/old-word/discardOld", {count: result.deletedCount});
  }

}


export type OldWord = DocumentType<OldWordSchema>;
export const OldWordModel = getModelForClass(OldWordSchema);
