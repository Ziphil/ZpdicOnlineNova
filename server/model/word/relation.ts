//

import {getModelForClass, prop} from "@typegoose/typegoose";
import type {
  Relation as RelationSkeleton
} from "/client/skeleton";


export class RelationSchema {

  @prop({required: true, type: String})
  public titles!: Array<string>;

  @prop({required: true})
  public number!: number;

  @prop({required: true})
  public name!: string;

}


export class RelationCreator {

  public static create(raw: Relation): RelationSkeleton {
    const titles = raw.titles;
    const number = raw.number;
    const name = raw.name;
    const skeleton = {titles, number, name};
    return skeleton;
  }

}


export type Relation = RelationSchema;
export const RelationModel = getModelForClass(RelationSchema);