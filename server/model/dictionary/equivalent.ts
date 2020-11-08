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
    let title = raw.title;
    let names = raw.names;
    let skeleton = EquivalentSkeleton.of({title, names});
    return skeleton;
  }

}


export type Equivalent = EquivalentSchema;
export let EquivalentModel = getModelForClass(EquivalentSchema);