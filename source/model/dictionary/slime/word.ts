//

import {
  DocumentType,
  Ref,
  arrayProp,
  getModelForClass,
  prop
} from "@hasezoey/typegoose";
import {
  SlimeDictionary
} from "./dictionary";
import {
  SlimeEquivalent
} from "./equivalent";
import {
  SlimeInformation
} from "./information";
import {
  SlimeRelation
} from "./relation";
import {
  SlimeVariation
} from "./variation";


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


export type SlimeWordDocument = DocumentType<SlimeWord>;
export let SlimeWordModel = getModelForClass(SlimeWord);