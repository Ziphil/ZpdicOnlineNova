//

import {
  DocumentType,
  Ref,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import type {EditableWord} from "/server/internal/skeleton";
import {DiscardableSchema} from "/server/model/base";
import {Dictionary, DictionarySchema} from "/server/model/dictionary/dictionary";
import {CustomError} from "/server/model/error";
import {User} from "/server/model/user/user";
import {Relation} from "/server/model/word/relation";
import {SectionModel, SectionSchema} from "/server/model/word/section";
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

  /** 辞書に登録されている単語を編集します。
   * 渡された単語データと番号が同じ単語データがすでに存在する場合は、渡された単語データでそれを上書きします。
   * そうでない場合は、渡された単語データを新しいデータとして追加します。
   * 番号によってデータの修正か新規作成かを判断するので、既存の単語データの番号を変更する編集はできません。*/
  public static async edit(dictionary: Dictionary, word: EditableWord, user: User): Promise<Word> {
    const currentWord = await WordModel.findOneExist().where("dictionary", dictionary).where("number", word.number);
    let resultWord;
    if (currentWord) {
      resultWord = new WordModel(word);
      resultWord.dictionary = dictionary;
      resultWord.updatedUser = user;
      resultWord.createdDate = currentWord.createdDate;
      resultWord.updatedDate = new Date();
      await this.filterRelations(dictionary, resultWord);
      await currentWord.flagDiscarded();
      await resultWord.save();
      if (currentWord.name !== resultWord.name) {
        await this.correctRelationsByEdit(dictionary, resultWord);
      }
    } else {
      if (word.number === null) {
        word.number = await this.fetchNextNumber(dictionary);
      }
      resultWord = new WordModel(word);
      resultWord.dictionary = dictionary;
      resultWord.updatedUser = user;
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
      throw new CustomError("noSuchWord");
    }
    LogUtil.log("model/word/discard", {number: dictionary.number, currentId: word.id});
    return word;
  }

  /** 指定された番号の単語データに関連語を新たに追加します。
   * 指定された単語データにセクションが存在しない場合は、新たにセクションを作成し、そこに関連語を追加します。
   * 指定された単語データにセクションが存在する場合は、最初のセクションに関連語を追加します。 */
  public static async addRelation(dictionary: Dictionary, number: number, relation: Relation): Promise<Word | null> {
    const currentWord = await WordModel.findOneExist().where("dictionary", dictionary).where("number", number);
    if (currentWord) {
      const existRelation = currentWord.sections.some((existingSection) => existingSection.relations.some((existingRelation) => existingRelation.number === relation.number));
      if (!existRelation) {
        const resultWord = currentWord.copy();
        if (resultWord.sections.length <= 0) {
          const section = new SectionModel({equivalents: [], informations: [], phrases: [], variations: [], relations: [relation]});
          resultWord.sections.push(section);
        } else {
          resultWord.sections[0].relations.push(relation);
        }
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
      throw new CustomError("noSuchWord");
    }
  }

  /** 古い単語履歴データを完全に削除します。
   * 論理削除ではなく物理削除を行うので、もとには戻せません。*/
  public static async discardOlds(duration: number): Promise<void> {
    const date = new Date(Date.now() - duration * 24 * 60 * 60 * 1000);
    const result = await WordModel.deleteMany().lt("removedDate", date);
    LogUtil.log("model/word/discardOld", {count: result.deletedCount});
  }

  /** `word` に渡された単語データ内の関連語データのうち、現在存在していないものを削除します。
   * この処理は、`word` 内の関連語データを上書きします。*/
  private static async filterRelations(dictionary: Dictionary, word: Word): Promise<void> {
    const relationNumbers = word.sections.flatMap((section) => section.relations.map((relation) => relation.number));
    const relationWords = await WordModel.findExist().where("dictionary", dictionary).where("number", relationNumbers);
    word.sections = word.sections.map((section) => {
      section.relations = section.relations.filter((relation) => relationWords.some((relationWord) => relationWord.number === relation.number));
      return section;
    });
  }

  /** 単語データの編集によって単語の綴りが変化した場合に、それによって起こり得る関連語データの不整合を修正します。
   * この処理では、既存の単語データを上書きするので、編集履歴は残りません。*/
  private static async correctRelationsByEdit(dictionary: Dictionary, word: Word): Promise<void> {
    const affectedWords = await WordModel.findExist().where("dictionary", dictionary).where("sections.relations.number", word.number);
    for (const affectedWord of affectedWords) {
      for (const section of affectedWord.sections) {
        for (const relation of section.relations) {
          if (relation.number === word.number) {
            relation.name = word.name;
          }
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
    const affectedWords = await WordModel.findExist().where("dictionary", dictionary).where("sections.relations.number", word.number);
    const changedWords = [];
    for (const affectedWord of affectedWords) {
      const changedWord = affectedWord.copy();
      changedWord.sections = affectedWord.sections.map((section) => {
        section.relations = section.relations.filter((relation) => relation.number !== word.number);
        return section;
      });
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
    const word = new WordModel({
      dictionary: this.dictionary,
      number: this.number,
      name: this.name,
      pronunciation: this.pronunciation,
      tags: this.tags,
      sections: this.sections.map((section) => new SectionModel(section)),
      createdDate: this.createdDate
    });
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