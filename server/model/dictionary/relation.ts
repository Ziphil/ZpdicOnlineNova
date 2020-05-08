//

import {
  DocumentType,
  getModelForClass,
  prop
} from "@hasezoey/typegoose";


export class Relation {

  @prop({required: true})
  public title!: string;

  @prop({required: true})
  public number!: number;

  @prop({required: true})
  public name!: string;

}


export type RelationDocument = DocumentType<Relation>;
export let RelationModel = getModelForClass(Relation);