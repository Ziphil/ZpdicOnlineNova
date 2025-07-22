//

import {getModelForClass, modelOptions, prop} from "@typegoose/typegoose";


@modelOptions({schemaOptions: {autoCreate: false, collection: "variations"}})
export class VariationSchema {

  @prop({required: true})
  public title!: string;

  @prop({required: true})
  public name!: string;

  @prop()
  public pronunciation?: string;

}


export type Variation = VariationSchema;
export const VariationModel = getModelForClass(VariationSchema);