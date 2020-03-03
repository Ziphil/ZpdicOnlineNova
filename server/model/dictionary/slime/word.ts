//

import {
  DocumentType,
  Ref,
  arrayProp,
  getModelForClass,
  prop
} from "@hasezoey/typegoose";
import {
  SlimeDictionary,
  SlimeEquivalent,
  SlimeEquivalentSkeleton,
  SlimeInformation,
  SlimeInformationSkeleton,
  SlimeRelation,
  SlimeRelationSkeleton,
  SlimeVariation,
  SlimeVariationSkeleton
} from "/server/model/dictionary/slime";


export class SlimeWord {

  @prop({required: true, ref: SlimeDictionary})
  public dictionary!: Ref<SlimeDictionary>;

  @prop({required: true})
  public number!: number;

  @prop({required: true})
  public name!: string;

  @arrayProp({required: true, items: SlimeEquivalent})
  public equivalents!: Array<SlimeEquivalent>;

  @arrayProp({required: true, items: String})
  public tags!: Array<string>;

  @arrayProp({required: true, items: SlimeInformation})
  public informations!: Array<SlimeInformation>;

  @arrayProp({required: true, items: SlimeVariation})
  public variations!: Array<SlimeVariation>;

  @arrayProp({required: true, items: SlimeRelation})
  public relations!: Array<SlimeRelation>;

}


export class SlimeWordSkeleton {

  public id: string;
  public number: number;
  public name: string;
  public equivalents: Array<SlimeEquivalentSkeleton>;
  public tags: Array<string>;
  public informations: Array<SlimeInformationSkeleton>;
  public variations: Array<SlimeVariationSkeleton>;
  public relations: Array<SlimeRelationSkeleton>;

  public constructor(word: SlimeWordDocument) {
    this.id = word.id;
    this.number = word.number;
    this.name = word.name;
    this.equivalents = word.equivalents.map((equivalent) => new SlimeEquivalentSkeleton(equivalent));
    this.tags = word.tags;
    this.informations = word.informations.map((information) => new SlimeInformationSkeleton(information));
    this.variations = word.variations.map((variation) => new SlimeVariationSkeleton(variation));
    this.relations = word.relations.map((relation) => new SlimeRelationSkeleton(relation));
  }

}


export type SlimeWordDocument = DocumentType<SlimeWord>;
export let SlimeWordModel = getModelForClass(SlimeWord);