//

import {getModelForClass, modelOptions, prop} from "@typegoose/typegoose";


@modelOptions({schemaOptions: {autoCreate: false, collection: "linkedExampleOffers"}})
export class LinkedExampleOfferSchema {

  @prop({required: true})
  public catalog!: string;

  @prop({required: true})
  public number!: number;

}


export type LinkedExampleOffer = LinkedExampleOfferSchema;
export const LinkedExampleOfferModel = getModelForClass(LinkedExampleOfferSchema);