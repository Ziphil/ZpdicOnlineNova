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
    let title = raw.title;
    let number = raw.number;
    let name = raw.name;
    let skeleton = {title, number, name};
    return skeleton;
  }

}


export type Relation = RelationSchema;
export let RelationModel = getModelForClass(RelationSchema);