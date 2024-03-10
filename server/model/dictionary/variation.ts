//

import {
  getModelForClass,
  prop
} from "@typegoose/typegoose";
import {
  Variation as VariationSkeleton
} from "/client-new/skeleton";


export class VariationSchema {

  @prop({required: true})
  public title!: string;

  @prop({required: true})
  public name!: string;

}


export class VariationCreator {

  public static create(raw: Variation): VariationSkeleton {
    const title = raw.title;
    const name = raw.name;
    const skeleton = {title, name};
    return skeleton;
  }

}


export type Variation = VariationSchema;
export const VariationModel = getModelForClass(VariationSchema);