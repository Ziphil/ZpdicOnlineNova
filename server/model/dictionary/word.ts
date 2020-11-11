//

import {
  DocumentType,
  Ref,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import {
  Word as WordSkeleton
} from "/client/skeleton/dictionary";
import {
  RemovableSchema
} from "/server/model/base";
import {
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

  @prop()
  public removedDate?: Date;

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
    let skeleton = WordSkeleton.of({id, number, name, pronunciation, equivalents, tags, informations, variations, relations, createdDate, updatedDate});
    return skeleton;
  }

}


export type Word = DocumentType<WordSchema>;
export let WordModel = getModelForClass(WordSchema);