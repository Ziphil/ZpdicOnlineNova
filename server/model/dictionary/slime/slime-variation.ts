//

import {
  DocumentType,
  getModelForClass,
  prop
} from "@hasezoey/typegoose";


export class SlimeVariation {

  @prop({required: true})
  public title!: string;

  @prop({required: true})
  public name!: string;

}


export type SlimeVariationDocument = DocumentType<SlimeVariation>;
export let SlimeVariationModel = getModelForClass(SlimeVariation);