//

import {
  DocumentType,
  Ref,
  arrayProp,
  getModelForClass,
  prop
} from "@hasezoey/typegoose";
import {
  Dictionary,
  Equivalent,
  EquivalentCreator,
  Information,
  InformationCreator,
  Relation,
  RelationCreator,
  Variation,
  VariationCreator
} from "/server/model/dictionary";
import {
  Word as WordSkeleton
} from "/server/skeleton/dictionary";


export class Word {

  @prop({required: true, ref: Dictionary})
  public dictionary!: Ref<Dictionary>;

  @prop({required: true})
  public number!: number;

  @prop({required: true})
  public name!: string;

  @arrayProp({required: true, items: Equivalent})
  public equivalents!: Array<Equivalent>;

  @arrayProp({required: true, items: String})
  public tags!: Array<string>;

  @arrayProp({required: true, items: Information})
  public informations!: Array<Information>;

  @arrayProp({required: true, items: Variation})
  public variations!: Array<Variation>;

  @arrayProp({required: true, items: Relation})
  public relations!: Array<Relation>;

}


export class WordCreator {

  public static create(raw: WordDocument): WordSkeleton {
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


export type WordDocument = DocumentType<Word>;
export let WordModel = getModelForClass(Word);