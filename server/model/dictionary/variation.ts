//

import {
  DocumentType,
  getModelForClass,
  prop
} from "@hasezoey/typegoose";


export class Variation {

  @prop({required: true})
  public title!: string;

  @prop({required: true})
  public name!: string;

}


export type VariationDocument = DocumentType<Variation>;
export let VariationModel = getModelForClass(Variation);