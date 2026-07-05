//

import {
  DocumentType,
  Ref,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import {Jsonify} from "jsonify-type";
import {OldArticleModel} from "/server/model/article/old-article";
import {Dictionary, DictionarySchema} from "/server/model/dictionary/dictionary";
import {CustomError} from "/server/model/error";
import {User} from "/server/model/user/user";
import {LogUtil} from "/server/util/log";


@modelOptions({schemaOptions: {collection: "articles"}})
export class ArticleSchema {

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

  public static async edit(dictionary: Dictionary, article: EditableArticle, user: User): Promise<Article> {
    const currentArticle = await ArticleModel.findOne().where("dictionary", dictionary).where("number", article.number);
    let resultArticle;
    if (currentArticle) {
      resultArticle = new ArticleModel(article);
      resultArticle.dictionary = dictionary;
      resultArticle.updatedUser = user;
      resultArticle.createdDate = currentArticle.createdDate;
      resultArticle.updatedDate = new Date();
      await currentArticle.deleteOneSoftly();
      await resultArticle.save();
    } else {
      if (article.number === null) {
        article.number = await this.fetchNextNumber(dictionary);
      }
      resultArticle = new ArticleModel(article);
      resultArticle.dictionary = dictionary;
      resultArticle.updatedUser = user;
      resultArticle.createdDate = new Date();
      resultArticle.updatedDate = new Date();
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

  public async deleteOneSoftly(this: Article): Promise<void> {
    const oldArticle = new OldArticleModel(this.toObject({depopulate: true}));
    oldArticle.removedDate = new Date();
    await oldArticle.save();
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