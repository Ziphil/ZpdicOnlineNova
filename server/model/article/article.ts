//

import {
  DocumentType,
  Ref,
  getModelForClass,
  index,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import {Jsonify} from "jsonify-type";
import {OldArticleModel} from "/server/model/article/old-article";
import {ARTICLE_LIMITS} from "/server/model/constant";
import {Dictionary, DictionarySchema} from "/server/model/dictionary/dictionary";
import {CustomError} from "/server/model/error";
import {User, UserSchema} from "/server/model/user/user";
import {LogUtil} from "/server/util/log";
import {calcDataSize, createMaxCountValidator} from "/server/util/validation";


@modelOptions({schemaOptions: {collection: "articles"}})
@index({"dictionary": 1, "number": 1})
@index({"dictionary": 1, "updatedDate": -1, "_id": -1})
export class ArticleSchema {

  @prop({required: true, ref: "DictionarySchema"})
  public dictionary!: Ref<DictionarySchema>;

  @prop({required: true})
  public number!: number;

  @prop({type: String, innerOptions: {maxlength: ARTICLE_LIMITS.tagLength}, outerOptions: {validate: createMaxCountValidator(ARTICLE_LIMITS.tagCount)}})
  public tags!: Array<string>;

  @prop({required: true, maxlength: ARTICLE_LIMITS.titleLength})
  public title!: string;

  @prop({required: true, maxlength: ARTICLE_LIMITS.contentLength})
  public content!: string;

  @prop({required: true, ref: "UserSchema"})
  public updatedUser!: Ref<UserSchema>;

  @prop({required: true})
  public createdDate!: Date;

  @prop({required: true})
  public updatedDate!: Date;

  public static async edit(dictionary: Dictionary, article: EditableArticle, user: User): Promise<Article> {
    const currentArticle = await ArticleModel.findOne().where("dictionary", dictionary).where("number", article.number);
    let resultArticle;
    if (currentArticle) {
      resultArticle = new ArticleModel(article);
      resultArticle.dictionary = dictionary;
      resultArticle.updatedUser = user;
      resultArticle.createdDate = currentArticle.createdDate;
      resultArticle.updatedDate = new Date();
      await resultArticle.assertLimits();
      await currentArticle.deleteOneSoftly();
      await resultArticle.save();
    } else {
      await dictionary.assertArticleCount();
      if (article.number === null) {
        article.number = await dictionary.issueNextNumber("article");
      } else {
        await dictionary.raiseMaxNumber("article", article.number);
      }
      resultArticle = new ArticleModel(article);
      resultArticle.dictionary = dictionary;
      resultArticle.updatedUser = user;
      resultArticle.createdDate = new Date();
      resultArticle.updatedDate = new Date();
      await resultArticle.assertLimits();
      await resultArticle.save();
    }
    LogUtil.log("model/article/edit", {number: dictionary.number, currentId: currentArticle?.id, resultId: resultArticle.id});
    return resultArticle;
  }

  public static async discard(dictionary: Dictionary, number: number): Promise<Article> {
    const example = await ArticleModel.findOne().where("dictionary", dictionary).where("number", number);
    if (example) {
      await example.deleteOneSoftly();
    } else {
      throw new CustomError("noSuchArticle");
    }
    LogUtil.log("model/article/discard", {number: dictionary.number, currentId: example.id});
    return example;
  }

  /** この記事データが各種の上限に違反していないか検査します。
   * 保存する前にこのメソッドを呼び出します。*/
  public async assertLimits(this: Article): Promise<void> {
    this.assertSize();
    await this.assertFields();
  }

  /** この記事データ全体の大きさが上限を超えていないか検査します。*/
  public assertSize(this: Article): void {
    if (calcDataSize(this) > ARTICLE_LIMITS.size) {
      throw new CustomError("articleSizeExceeded");
    }
  }

  /** この記事データの各フィールドが上限を超えていないか検査します。
   * 既存の記事データを論理削除する前に検査することで、上限違反によって保存に失敗したときにデータが失われるのを防ぎます。*/
  public async assertFields(this: Article): Promise<void> {
    try {
      await this.validate();
    } catch (error) {
      if (error instanceof Error && error.name === "ValidationError") {
        throw new CustomError("invalidArticle");
      } else {
        throw error;
      }
    }
  }

  /** この記事データを論理削除します。
   * 履歴データは上限の検査対象外とするため、履歴データの検証は行いません。*/
  public async deleteOneSoftly(this: Article): Promise<void> {
    const oldArticle = new OldArticleModel(this.toObject({depopulate: true}));
    oldArticle.deletedDate = new Date();
    await oldArticle.save({validateBeforeSave: false});
    await ArticleModel.deleteOne().where("_id", this["_id"]);
  }

}


export type Article = DocumentType<ArticleSchema>;
export const ArticleModel = getModelForClass(ArticleSchema);

export type EditableArticle = Pick<Jsonify<Article>, "tags" | "title" | "content"> & {number: number | null};