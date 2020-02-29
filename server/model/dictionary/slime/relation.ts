//

import {
  DocumentType,
  Ref,
  getModelForClass,
  prop
} from "@hasezoey/typegoose";


export class SlimeRelation {

  @prop({required: true})
  public title!: string;

  @prop({required: true})
  public number!: number;

  @prop({required: true})
  public name!: string;

}


export type SlimeRelationDocument = DocumentType<SlimeRelation>;
export let SlimeRelationModel = getModelForClass(SlimeRelation);