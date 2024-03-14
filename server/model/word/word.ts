//

import {
  DocumentType,
  Ref,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import type {EditableWord} from "/client/skeleton";
import {DiscardableSchema} from "/server/model/base";
import {Dictionary, DictionarySchema} from "/server/model/dictionary/dictionary";
import {CustomError} from "/server/model/error";
import {EquivalentSchema} from "/server/model/word/equivalent";
import {InformationSchema} from "/server/model/word/information";
import {Relation, RelationSchema} from "/server/model/word/relation";
import {VariationSchema} from "/server/model/word/variation";
import {LogUtil} from "/server/util/log";


@modelOptions({schemaOptions: {collection: "words"}})
export class WordSchema extends DiscardableSchema {

  @prop({required: true, ref: "DictionarySchema"})
  public dictionary!: Ref<DictionarySchema>;

  @prop({required: true})
  public number!: number;

  @prop({required: true})
  public name!: string;

  @prop()
  public pronunciation?: string;

  @prop({required: true, type: EquivalentSchema})
  public equivalents!: Array<EquivalentSchema>;

  @prop({required: true, type: String})
  public tags!: Array<string>;

  @prop({required: true, type: InformationSchema})
  public informations!: Array<InformationSchema>;

  @prop({required: true, type: VariationSchema})
  public variations!: Array<VariationSchema>;

  @prop({required: true, type: RelationSchema})
  public relations!: Array<RelationSchema>;

  @prop()
  public createdDate?: Date;

  @prop()
  public updatedDate?: Date;

  /** 辞書に登録されている単語を編集します。
   * 渡された単語データと番号が同じ単語データがすでに存在する場合は、渡された単語データでそれを上書きします。
   * そうでない場合は、渡された単語データを新しいデータとして追加します。
   * 番号によってデータの修正か新規作成かを判断するので、既存の単語データの番号を変更する編集はできません。*/
  public static async edit(dictionary: Dictionary, word: EditableWord): Promise<Word> {
    const currentWord = await WordModel.findOneExist().where("dictionary", dictionary).where("number", word.number);
    let resultWord;
    if (currentWord) {
      resultWord = new WordModel(word);
      resultWord.dictionary = dictionary;
      resultWord.createdDate = currentWord.createdDate;
      resultWord.updatedDate = new Date();
      await this.filterRelations(dictionary, resultWord);
      await currentWord.flagDiscarded();
      await resultWord.save();
      if (currentWord.name !== resultWord.name) {
        await this.correctRelationsByEdit(dictionary, resultWord);
      }
    } else {
      if (word.number === undefined) {
        word.number = await this.fetchNextNumber(dictionary);
      }
      resultWord = new WordModel(word);
      resultWord.dictionary = dictionary;
      resultWord.createdDate = new Date();
      resultWord.updatedDate = new Date();
      await this.filterRelations(dictionary, resultWord);
      await resultWord.save();
    }
    LogUtil.log("model/word/edit", {number: dictionary.number, currentId: currentWord?.id, resultId: resultWord.id});
    return resultWord;
  }

  public static async discard(dictionary: Dictionary, number: number): Promise<Word> {
    const word = await WordModel.findOneExist().where("dictionary", dictionary).where("number", number);
    if (word) {
      await word.flagDiscarded();
      await this.correctRelationsByDiscard(dictionary, word);
    } else {
      throw new CustomError("noSuchWordNumber");
    }
    LogUtil.log("model/word/discard", {number: dictionary.number, currentId: word.id});
    return word;
  }

  public static async addRelation(dictionary: Dictionary, number: number, relation: Relation): Promise<Word | null> {
    const currentWord = await WordModel.findOneExist().where("dictionary", dictionary).where("number", number);
    if (currentWord) {
      const existRelation = currentWord.relations.some((existingRelation) => existingRelation.number === relation.number);
      if (!existRelation) {
        const resultWord = currentWord.copy();
        resultWord.relations.push(relation);
        resultWord.createdDate = currentWord.createdDate;
        resultWord.updatedDate = new Date();
        await currentWord.flagDiscarded();
        await resultWord.save();
        LogUtil.log("model/word/addRelation", {number: dictionary.number, currentId: currentWord?.id, resultId: resultWord.id});
        return resultWord;
      } else {
        return null;
      }
    } else {
      throw new CustomError("noSuchWordNumber");
    }
  }

  /** 古い履歴データを完全に削除します。
   * 論理削除ではなく物理削除を行うので、もとには戻せません。*/
  public static async discardOldHistory(duration: number): Promise<void> {
    const date = new Date(Date.now() - duration * 24 * 60 * 60 * 1000);
    const result = await WordModel.deleteMany().lt("removedDate", date);
    LogUtil.log("model/word/discardOld", {count: result.deletedCount});
  }

  /** `word` に渡された単語データ内の関連語データのうち、現在存在していないものを削除します。
   * この処理は、`word` 内の関連語データを上書きします。*/
  private static async filterRelations(dictionary: Dictionary, word: Word): Promise<void> {
    const relationNumbers = word.relations.map((relation) => relation.number);
    const relationWords = await WordModel.findExist().where("dictionary", dictionary).where("number", relationNumbers);
    word.relations = word.relations.filter((relation) => relationWords.some((relationWord) => relationWord.number === relation.number));
  }

  /** 単語データの編集によって単語の綴りが変化した場合に、それによって起こり得る関連語データの不整合を修正します。
   * この処理では、既存の単語データを上書きするので、編集履歴は残りません。*/
  private static async correctRelationsByEdit(dictionary: Dictionary, word: Word): Promise<void> {
    const affectedWords = await WordModel.findExist().where("dictionary", dictionary).where("relations.number", word.number);
    for (const affectedWord of affectedWords) {
      for (const relation of affectedWord.relations) {
        if (relation.number === word.number) {
          relation.name = word.name;
        }
      }
    }
    const promises = affectedWords.map((affectedWord) => affectedWord.save());
    LogUtil.log("model/word/correctRelationsByEdit", {number: dictionary.number, affectedIds: affectedWords.map((word) => word.id)});
    await Promise.all(promises);
  }

  /** 単語データを削除した場合に、それによって起こり得る関連語データの不整合を修正します。
   * この処理では、修正が必要な既存の単語データを論理削除した上で、関連語データの不整合を修正した新しい単語データを作成します。
   * そのため、この処理の内容は、修正を行った単語データに編集履歴として残ります。*/
  private static async correctRelationsByDiscard(dictionary: Dictionary, word: Word): Promise<void> {
    const affectedWords = await WordModel.findExist().where("dictionary", dictionary).where("relations.number", word.number);
    const changedWords = [];
    for (const affectedWord of affectedWords) {
      const changedWord = affectedWord.copy();
      changedWord.relations = affectedWord.relations.filter((relation) => relation.number !== word.number);
      changedWord.updatedDate = new Date();
      changedWords.push(changedWord);
    }
    const affectedPromises = affectedWords.map((affectedWord) => affectedWord.flagDiscarded());
    const changedPromises = changedWords.map((changedWord) => changedWord.save());
    LogUtil.log("model/word/correctRelationsByDiscard", {number: dictionary.number, affectedIds: affectedWords.map((word) => word.id)});
    await Promise.all([...affectedPromises, ...changedPromises]);
  }

  /** この単語データをコピーした新しい単語データを返します。*/
  public copy(this: Word): Word {
    const dictionary = this.dictionary;
    const number = this.number;
    const name = this.name;
    const pronunciation = this.pronunciation;
    const equivalents = this.equivalents;
    const tags = this.tags;
    const informations = this.informations;
    const variations = this.variations;
    const relations = this.relations;
    const createdDate = this.createdDate;
    const word = new WordModel({dictionary, number, name, pronunciation, equivalents, tags, informations, variations, relations, createdDate});
    return word;
  }

  private static async fetchNextNumber(dictionary: Dictionary): Promise<number> {
    const words = await WordModel.find().where("dictionary", dictionary).select("number").sort("-number").limit(1);
    if (words.length > 0) {
      return words[0].number + 1;
    } else {
      return 1;
    }
  }

}


export type Word = DocumentType<WordSchema>;
export const WordModel = getModelForClass(WordSchema);