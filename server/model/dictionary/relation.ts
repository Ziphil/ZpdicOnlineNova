//

import {
  getModelForClass,
  prop
} from "@typegoose/typegoose";
import {
  Relation as RelationSkeleton
} from "/client/skeleton/dictionary";


export class RelationSchema {

  @prop({required: true})
  public title!: string;

  @prop({required: true})
  public number!: number;

  @prop({required: true})
  public name!: string;

}


export class RelationCreator {

  public static create(raw: Relation): RelationSkeleton {
    const title = raw.title;
    const number = raw.number;
    const name = raw.name;
    const skeleton = {title, number, name};
    return skeleton;
  }

}


export type Relation = RelationSchema;
export const RelationModel = getModelForClass(RelationSchema);