//

import {
  getModelForClass,
  prop
} from "@typegoose/typegoose";
import {
  Variation as VariationSkeleton
} from "/client/skeleton/dictionary";


export class VariationSchema {

  @prop({required: true})
  public title!: string;

  @prop({required: true})
  public name!: string;

}


export class VariationCreator {

  public static create(raw: Variation): VariationSkeleton {
    let title = raw.title;
    let name = raw.name;
    let skeleton = {title, name};
    return skeleton;
  }

}


export type Variation = VariationSchema;
export let VariationModel = getModelForClass(VariationSchema);