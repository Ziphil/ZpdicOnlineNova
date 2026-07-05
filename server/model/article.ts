//

import {
  DocumentType,
  Ref,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import {Jsonify} from "jsonify-type";
import {Dictionary, DictionarySchema} from "/server/model/dictionary/dictionary";
import {CustomError} from "/server/model/error";
import {OldArticleModel} from "/server/model/old-article";
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

  public static async edit(dictionary: Dictionary, example: EditableArticle, user: User): Promise<Article> {
    const currentExample = await ArticleModel.findOne().where("dictionary", dictionary).where("number", example.number);
    let resultExample;
    if (currentExample) {
      resultExample = new ArticleModel(example);
      resultExample.dictionary = dictionary;
      resultExample.updatedUser = user;
      resultExample.createdDate = currentExample.createdDate;
      resultExample.updatedDate = new Date();
      await currentExample.discardSoftly();
      await resultExample.save();
    } else {
      if (example.number === null) {
        example.number = await this.fetchNextNumber(dictionary);
      }
      resultExample = new ArticleModel(example);
      resultExample.dictionary = dictionary;
      resultExample.updatedUser = user;
      resultExample.createdDate = new Date();
      resultExample.updatedDate = new Date();
      await resultExample.save();
    }
    LogUtil.log("model/article/edit", {number: dictionary.number, currentId: currentExample?.id, resultId: resultExample.id});
    return resultExample;
  }

  public static async discard(dictionary: Dictionary, number: number): Promise<Article> {
    const example = await ArticleModel.findOne().where("dictionary", dictionary).where("number", number);
    if (example) {
      await example.discardSoftly();
    } else {
      throw new CustomError("noSuchArticle");
    }
    LogUtil.log("model/article/discard", {number: dictionary.number, currentId: example.id});
    return example;
  }

  public async discardSoftly(this: Article): Promise<void> {
    const oldArticle = new OldArticleModel(this.toObject({depopulate: true}));
    oldArticle.removedDate = new Date();
    await oldArticle.save();
    await ArticleModel.deleteOne().where("_id", this["_id"]);
  }

  /** 指定された辞書において次に記事データに割り振るべき番号を返します。
   * すでに削除された記事データの番号と重複しないように、`oldarticles` コレクション内の履歴データも含めた最大番号に 1 を加えた値を返します。*/
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