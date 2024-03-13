//

import {getModelForClass, prop} from "@typegoose/typegoose";
import type {
  Equivalent as EquivalentSkeleton
} from "/client/skeleton";


export class EquivalentSchema {

  @prop({required: true, type: String})
  public titles!: Array<string>;

  @prop({required: true, type: String})
  public names!: Array<string>;

}


export class EquivalentCreator {

  public static create(raw: Equivalent): EquivalentSkeleton {
    const titles = raw.titles;
    const names = raw.names;
    const skeleton = {titles, names};
    return skeleton;
  }

}


export type Equivalent = EquivalentSchema;
export const EquivalentModel = getModelForClass(EquivalentSchema);