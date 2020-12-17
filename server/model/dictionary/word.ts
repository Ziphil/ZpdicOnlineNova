//

import {
  DocumentType,
  Ref,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import {
  EditableWord as EditableWordSkeleton,
  Word as WordSkeleton
} from "/client/skeleton/dictionary";
import {
  RemovableSchema
} from "/server/model/base";
import {
  Dictionary,
  DictionarySchema,
  EquivalentCreator,
  EquivalentSchema,
  InformationCreator,
  InformationSchema,
  RelationCreator,
  RelationSchema,
  VariationCreator,
  VariationSchema
} from "/server/model/dictionary";
import {
  CustomError
} from "/server/model/error";
import {
  LogUtil
} from "/server/util/log";


@modelOptions({schemaOptions: {collection: "words"}})
export class WordSchema extends RemovableSchema {

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

  // 辞書に登録されている単語を編集します。
  // 渡された単語データと番号が同じ単語データがすでに存在する場合は、渡された単語データでそれを上書きします。
  // そうでない場合は、渡された単語データを新しいデータとして追加します。
  // 番号によってデータの修正か新規作成かを判断するので、既存の単語データの番号を変更する編集はできません。
  public static async editOne(dictionary: Dictionary, word: EditableWordSkeleton): Promise<Word> {
    let currentWord = await WordModel.findOneExist().where("dictionary", dictionary).where("number", word.number);
    let resultWord;
    if (currentWord) {
      resultWord = new WordModel(word);
      resultWord.dictionary = dictionary;
      resultWord.createdDate = currentWord.createdDate;
      resultWord.updatedDate = new Date();
      await currentWord.flagRemoveOne();
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
      await resultWord.save();
    }
    LogUtil.log("word/edit", `number: ${dictionary.number} | current: ${currentWord?.id} | result: ${resultWord.id}`);
    return resultWord;
  }

  public static async removeOne(dictionary: Dictionary, number: number): Promise<Word> {
    let word = await WordModel.findOneExist().where("dictionary", dictionary).where("number", number);
    if (word) {
      await word.flagRemoveOne();
      await this.correctRelationsByRemove(dictionary, word);
    } else {
      throw new CustomError("noSuchWordNumber");
    }
    LogUtil.log("word/remove", `number: ${dictionary.number} | current: ${word.id}`);
    return word;
  }

  // 単語データの編集によって単語の綴りが変化した場合に、それによって起こり得る関連語データの不整合を修正します。
  // この処理では、既存の単語データを上書きするので、編集履歴は残りません。
  private static async correctRelationsByEdit(dictionary: Dictionary, word: Word): Promise<void> {
    let affectedWords = await WordModel.findExist().where("dictionary", dictionary).where("relations.number", word.number);
    for (let affectedWord of affectedWords) {
      for (let relation of affectedWord.relations) {
        if (relation.number === word.number) {
          relation.name = word.name;
        }
      }
    }
    let promises = affectedWords.map((affectedWord) => affectedWord.save());
    LogUtil.log("word/correct-relations-edit", `number: ${dictionary.number} | affected: ${affectedWords.map((word) => word.id).join(", ")}`);
    await Promise.all(promises);
  }

  // 単語データを削除した場合に、それによって起こり得る関連語データの不整合を修正します。
  // この処理では、修正が必要な既存の単語データを論理削除した上で、関連語データの不整合を修正した新しい単語データを作成します。
  // そのため、この処理の内容は、修正を行った単語データに編集履歴として残ります。
  private static async correctRelationsByRemove(dictionary: Dictionary, word: Word): Promise<void> {
    let affectedWords = await WordModel.findExist().where("dictionary", dictionary).where("relations.number", word.number);
    let changedWords = [];
    for (let affectedWord of affectedWords) {
      let changedWord = affectedWord.copy();
      changedWord.relations = affectedWord.relations.filter((relation) => relation.number !== word.number);
      changedWord.updatedDate = new Date();
      changedWords.push(changedWord);
    }
    let affectedPromises = affectedWords.map((affectedWord) => affectedWord.flagRemoveOne());
    let changedPromises = changedWords.map((changedWord) => changedWord.save());
    LogUtil.log("word/correct-relations-remove", `number: ${dictionary.number} | affected: ${affectedWords.map((word) => word.id).join(", ")}`);
    await Promise.all([...affectedPromises, ...changedPromises]);
  }

  // この単語データをコピーした新しい単語データを返します。
  public copy(this: Word): Word {
    let dictionary = this.dictionary;
    let number = this.number;
    let name = this.name;
    let pronunciation = this.pronunciation;
    let equivalents = this.equivalents;
    let tags = this.tags;
    let informations = this.informations;
    let variations = this.variations;
    let relations = this.relations;
    let createdDate = this.createdDate;
    let word = new WordModel({dictionary, number, name, pronunciation, equivalents, tags, informations, variations, relations, createdDate});
    return word;
  }

  private static async fetchNextNumber(dictionary: Dictionary): Promise<number> {
    let words = await WordModel.find().where("dictionary", dictionary).select("number").sort("-number").limit(1);
    if (words.length > 0) {
      return words[0].number + 1;
    } else {
      return 1;
    }
  }

}


export class WordCreator {

  public static create(raw: Word): WordSkeleton {
    let id = raw.id;
    let number = raw.number;
    let name = raw.name;
    let pronunciation = raw.pronunciation;
    let equivalents = raw.equivalents.map(EquivalentCreator.create);
    let tags = raw.tags;
    let informations = raw.informations.map(InformationCreator.create);
    let variations = raw.variations.map(VariationCreator.create);
    let relations = raw.relations.map(RelationCreator.create);
    let createdDate = raw.createdDate?.toISOString() ?? undefined;
    let updatedDate = raw.updatedDate?.toISOString() ?? undefined;
    let skeleton = {id, number, name, pronunciation, equivalents, tags, informations, variations, relations, createdDate, updatedDate};
    return skeleton;
  }

}


export type Word = DocumentType<WordSchema>;
export let WordModel = getModelForClass(WordSchema);