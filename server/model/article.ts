//

import {
  DocumentType,
  Ref,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import {Jsonify} from "jsonify-type";
import {DiscardableSchema} from "/server/model/base";
import {Dictionary, DictionarySchema} from "/server/model/dictionary/dictionary";
import {CustomError} from "/server/model/error";
import {User} from "/server/model/user/user";
import {LogUtil} from "/server/util/log";


@modelOptions({schemaOptions: {collection: "articles"}})
export class ArticleSchema extends DiscardableSchema {

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
    const currentExample = await ArticleModel.findOneExist().where("dictionary", dictionary).where("number", example.number);
    let resultExample;
    if (currentExample) {
      resultExample = new ArticleModel(example);
      resultExample.dictionary = dictionary;
      resultExample.updatedUser = user;
      resultExample.createdDate = currentExample.createdDate;
      resultExample.updatedDate = new Date();
      await currentExample.flagDiscarded();
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
    const example = await ArticleModel.findOneExist().where("dictionary", dictionary).where("number", number);
    if (example) {
      await example.flagDiscarded();
    } else {
      throw new CustomError("noSuchArticle");
    }
    LogUtil.log("model/article/discard", {number: dictionary.number, currentId: example.id});
    return example;
  }

  /** 古い履歴データを完全に削除します。
     * 論理削除ではなく物理削除を行うので、もとには戻せません。*/
  public static async discardOlds(duration: number): Promise<void> {
    const date = new Date(Date.now() - duration * 24 * 60 * 60 * 1000);
    const result = await ArticleModel.deleteMany().lt("removedDate", date);
    LogUtil.log("model/article/discardOld", {count: result.deletedCount});
  }

  private static async fetchNextNumber(dictionary: Dictionary): Promise<number> {
    const examples = await ArticleModel.find().where("dictionary", dictionary).select("number").sort("-number").limit(1);
    if (examples.length > 0) {
      return examples[0].number + 1;
    } else {
      return 1;
    }
  }

}


export type Article = DocumentType<ArticleSchema>;
export const ArticleModel = getModelForClass(ArticleSchema);

export type EditableArticle = Pick<Jsonify<Article>, "tags" | "title" | "content"> & {number: number | null};