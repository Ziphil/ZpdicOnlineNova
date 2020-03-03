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


export class SlimeVariationSkeleton {

  public title: string;
  public name: string;

  public constructor(variation: SlimeVariation) {
    this.title = variation.title;
    this.name = variation.name;
  }

}


export type SlimeVariationDocument = DocumentType<SlimeVariation>;
export let SlimeVariationModel = getModelForClass(SlimeVariation);