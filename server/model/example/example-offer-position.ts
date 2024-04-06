//

import {modelOptions, prop} from "@typegoose/typegoose";


@modelOptions({schemaOptions: {autoCreate: false, collection: "exampleOfferPositions"}})
export class ExampleOfferPositionSchema {

  @prop({required: true})
  public name!: string;

  @prop({required: true})
  public index!: number;

}


export type ExampleOfferPosition = ExampleOfferPositionSchema;