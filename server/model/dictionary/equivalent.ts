//

import {
  getModelForClass,
  prop
} from "@typegoose/typegoose";
import {
  Equivalent as EquivalentSkeleton
} from "/client/skeleton/dictionary";


export class EquivalentSchema {

  @prop({required: true})
  public title!: string;

  @prop({required: true, type: String})
  public names!: Array<string>;

}


export class EquivalentCreator {

  public static create(raw: Equivalent): EquivalentSkeleton {
    const title = raw.title;
    const names = raw.names;
    const skeleton = {title, names};
    return skeleton;
  }

}


export type Equivalent = EquivalentSchema;
export const EquivalentModel = getModelForClass(EquivalentSchema);