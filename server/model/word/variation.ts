//

import {getModelForClass, prop} from "@typegoose/typegoose";


export class VariationSchema {

  @prop({required: true})
  public title!: string;

  @prop({required: true})
  public name!: string;

}


export type Variation = VariationSchema;
export const VariationModel = getModelForClass(VariationSchema);