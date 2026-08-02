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
import {ARTICLE_LIMITS, DICTIONARY_LIMITS} from "/server/model/constant";
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
    this.assertSize(article);
    const currentArticle = await ArticleModel.findOne().where("dictionary", dictionary).where("number", article.number);
    let resultArticle;
    if (currentArticle) {
      resultArticle = new ArticleModel(article);
      resultArticle.dictionary = dictionary;
      resultArticle.updatedUser = user;
      resultArticle.createdDate = currentArticle.createdDate;
      resultArticle.updatedDate = new Date();
      await this.assertFields(resultArticle);
      await currentArticle.deleteOneSoftly();
      await resultArticle.save();
    } else {
      await this.assertCount(dictionary);
      if (article.number === null) {
        article.number = await this.fetchNextNumber(dictionary);
      }
      resultArticle = new ArticleModel(article);
      resultArticle.dictionary = dictionary;
      resultArticle.updatedUser = user;
      resultArticle.createdDate = new Date();
      resultArticle.updatedDate = new Date();
      await this.assertFields(resultArticle);
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

  /** 記事データ全体の大きさが上限を超えていないか検査します。*/
  private static assertSize(article: EditableArticle | Article): void {
    if (calcDataSize(article) > ARTICLE_LIMITS.size) {
      throw new CustomError("articleSizeExceeded");
    }
  }

  /** 辞書に登録されている記事数が上限に達していないか検査します。
   * 記事データを新たに追加する場合にのみ呼び出します。*/
  private static async assertCount(dictionary: Dictionary): Promise<void> {
    const count = await dictionary.countArticles();
    if (count >= DICTIONARY_LIMITS.articleCountPerDictionary) {
      throw new CustomError("articleCountExceeded");
    }
  }

  /** 記事データの各フィールドが上限を超えていないか検査します。
   * 既存の記事データを論理削除する前に検査することで、上限違反によって保存に失敗したときにデータが失われるのを防ぎます。*/
  private static async assertFields(article: Article): Promise<void> {
    try {
      await article.validate();
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

  /** 指定された辞書において次に記事データに割り振るべき番号を返します。
   * すでに削除された記事データの番号と重複しないように、`oldArticles` コレクション内の履歴データも含めた最大番号に 1 を加えた値を返します。*/
  private static async fetchNextNumber(dictionary: Dictionary): Promise<number> {
    const [articles, oldArticles] = await Promise.all([
      ArticleModel.find().where("dictionary", dictionary).select("number").sort("-number").limit(1),
      OldArticleModel.find().where("dictionary", dictionary).select("number").sort("-number").limit(1)
    ]);
    const maxNumber = Math.max(articles[0]?.number ?? 0, oldArticles[0]?.number ?? 0);
    return maxNumber + 1;
  }

}


export type Article = DocumentType<ArticleSchema>;
export const ArticleModel = getModelForClass(ArticleSchema);

export type EditableArticle = Pick<Jsonify<Article>, "tags" | "title" | "content"> & {number: number | null};