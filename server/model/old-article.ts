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
import {LogUtil} from "/server/util/log";


@modelOptions({schemaOptions: {collection: "oldarticles"}})
export class OldArticleSchema {

  @prop({required: true, ref: "DictionarySchema"})
  public dictionary!: Ref<DictionarySchema>;

  @prop({required: true})
  public number!: number;

  @prop({type: String})
  public tags!: Array<string>;

  @prop({required: true})
  public title!: string;

  @prop({required: true})
  public content!: string;

  @prop({required: true, ref: "UserSchema"})
  public updatedUser!: Ref<User>;

  @prop({required: true})
  public createdDate!: Date;

  @prop({required: true})
  public updatedDate!: Date;

  @prop({required: true})
  public removedDate!: Date;

  /** 古い記事履歴データを完全に削除します。
   * 論理削除ではなく物理削除を行うので、もとには戻せません。*/
  public static async discardOlds(duration: number): Promise<void> {
    const date = new Date(Date.now() - duration * 24 * 60 * 60 * 1000);
    const result = await OldArticleModel.deleteMany().lt("removedDate", date);
    LogUtil.log("model/old-article/discardOld", {count: result.deletedCount});
  }

}


export type OldArticle = DocumentType<OldArticleSchema>;
export const OldArticleModel = getModelForClass(OldArticleSchema);
