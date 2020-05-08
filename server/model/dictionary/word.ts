//

import {
  DocumentType,
  Ref,
  arrayProp,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";
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
import {
  Word as WordSkeleton
} from "/server/skeleton/dictionary";


@modelOptions({schemaOptions: {collection: "words"}})
export class WordSchema {

  @prop({required: true, ref: DictionarySchema})
  public dictionary!: Ref<DictionarySchema>;

  @prop({required: true})
  public number!: number;

  @prop({required: true})
  public name!: string;

  @arrayProp({required: true, items: EquivalentSchema})
  public equivalents!: Array<EquivalentSchema>;

  @arrayProp({required: true, items: String})
  public tags!: Array<string>;

  @arrayProp({required: true, items: InformationSchema})
  public informations!: Array<InformationSchema>;

  @arrayProp({required: true, items: VariationSchema})
  public variations!: Array<VariationSchema>;

  @arrayProp({required: true, items: RelationSchema})
  public relations!: Array<RelationSchema>;

}


export class WordCreator {

  public static create(raw: Word): WordSkeleton {
    let id = raw.id;
    let number = raw.number;
    let name = raw.name;
    let equivalents = raw.equivalents.map(EquivalentCreator.create);
    let tags = raw.tags;
    let informations = raw.informations.map(InformationCreator.create);
    let variations = raw.variations.map(VariationCreator.create);
    let relations = raw.relations.map(RelationCreator.create);
    let skeleton = WordSkeleton.of({id, number, name, equivalents, tags, informations, variations, relations});
    return skeleton;
  }

}


export type Word = DocumentType<WordSchema>;
export let WordModel = getModelForClass(WordSchema);