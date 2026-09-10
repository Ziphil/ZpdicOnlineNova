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
import {DICTIONARY_LIMITS} from "/server/model/constant";
import {Dictionary, DictionarySchema} from "/server/model/dictionary/dictionary";
import {ResolvedDictionaryArticleLimits} from "/server/model/dictionary/limits/dictionary-article-limits";
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

  @prop({type: String, innerOptions: {maxlength: DICTIONARY_LIMITS.article.tagLength}, outerOptions: {validate: createMaxCountValidator(DICTIONARY_LIMITS.article.tagCount)}})
  public tags!: Array<string>;

  @prop({required: true, maxlength: DICTIONARY_LIMITS.article.titleLength})
  public title!: string;

  @prop({required: true, maxlength: DICTIONARY_LIMITS.article.contentLength})
  public content!: string;

  @prop({required: true, ref: "UserSchema"})
  public updatedUser!: Ref<UserSchema>;

  @prop({required: true})
  public createdDate!: Date;

  @prop({required: true})
  public updatedDate!: Date;

  public static async edit(dictionary: Dictionary, article: EditableArticle, user: User): Promise<Article> {
    const limits = dictionary.limits.resolve().article;
    const currentArticle = await ArticleModel.findOne().where("dictionary", dictionary).where("number", article.number);
    let resultArticle;
    if (currentArticle) {
      resultArticle = currentArticle;
      resultArticle.tags = article.tags;
      resultArticle.title = article.title;
      resultArticle.content = article.content;
      resultArticle.updatedUser = user;
      resultArticle.updatedDate = new Date();
      await resultArticle.assertLimits(limits);
      await resultArticle.save();
    } else {
      await dictionary.assertArticleCountLimits();
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
      await resultArticle.assertLimits(limits);
      await resultArticle.save();
    }
    LogUtil.log("model/article/edit", {number: dictionary.number, currentId: currentArticle?.id, resultId: resultArticle.id});
    return resultArticle;
  }

  public static async discard(dictionary: Dictionary, number: number): Promise<Article> {
    const article = await ArticleModel.findOne().where("dictionary", dictionary).where("number", number);
    if (article) {
      await article.deleteOne();
    } else {
      throw new CustomError("noSuchArticle");
    }
    LogUtil.log("model/article/discard", {number: dictionary.number, currentId: article.id});
    return article;
  }

  public async assertLimits(this: Article, limits: ResolvedDictionaryArticleLimits): Promise<void> {
    this.assertSizeLimits(limits);
    this.assertFieldLimits(limits);
    await this.assertSchema();
  }

  public assertSizeLimits(this: Article, limits: ResolvedDictionaryArticleLimits): void {
    if (calcDataSize(this.toObject({depopulate: true})) > limits.size) {
      throw new CustomError("articleSizeExceeded");
    }
  }

  public assertFieldLimits(this: Article, limits: ResolvedDictionaryArticleLimits): void {
    const valid = (
      this.title.length <= limits.titleLength &&
      this.content.length <= limits.contentLength &&
      this.tags.length <= limits.tagCount &&
      this.tags.every((tag) => tag.length <= limits.tagLength)
    );
    if (!valid) {
      throw new CustomError("invalidArticle");
    }
  }

  public async assertSchema(this: Article): Promise<void> {
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
   * 履歴データは上限の検査対象外とするため、履歴データの検証は行いません。
   * 現在は未使用ですが、論理削除に戻す可能性を考えて残してあります。*/
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