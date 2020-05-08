//

import {
  DocumentType,
  getModelForClass,
  prop
} from "@hasezoey/typegoose";
import {
  Relation as RelationSkeleton
} from "/server/skeleton/dictionary";


export class Relation {

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
    let skeleton = RelationSkeleton.of({title, number, name});
    return skeleton;
  }

}


export type RelationDocument = DocumentType<Relation>;
export let RelationModel = getModelForClass(Relation);