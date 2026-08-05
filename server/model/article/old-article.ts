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


@modelOptions({schemaOptions: {collection: "oldArticles"}})
@index({"dictionary": 1, "number": 1})
@index({"deletedDate": 1}, {expireAfterSeconds: RETENTION_PERIODS.oldData})
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
  public updatedUser!: Ref<UserSchema>;

  @prop({required: true})
  public createdDate!: Date;

  @prop({required: true})
  public updatedDate!: Date;

  @prop({required: true})
  public deletedDate!: Date;

}


export type OldArticle = DocumentType<OldArticleSchema>;
export const OldArticleModel = getModelForClass(OldArticleSchema);
