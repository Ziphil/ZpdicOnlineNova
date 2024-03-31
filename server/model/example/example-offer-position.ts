//

import {
  prop
} from "@typegoose/typegoose";


export class ExampleOfferPositionSchema {

  @prop({required: true})
  public name!: string;

  @prop({required: true})
  public index!: number;

}


export type ExampleOfferPosition = ExampleOfferPositionSchema;