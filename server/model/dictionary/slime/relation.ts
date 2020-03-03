//

import {
  DocumentType,
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


export class SlimeRelationSkeleton {

  public title: string;
  public number: number;
  public name: string;

  public constructor(relation: SlimeRelation) {
    this.title = relation.title;
    this.number = relation.number;
    this.name = relation.name;
  }

}


export type SlimeRelationDocument = DocumentType<SlimeRelation>;
export let SlimeRelationModel = getModelForClass(SlimeRelation);