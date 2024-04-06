//

import {getModelForClass, modelOptions, prop} from "@typegoose/typegoose";


@modelOptions({schemaOptions: {autoCreate: false, collection: "relations"}})
export class RelationSchema {

  @prop({required: true, type: String})
  public titles!: Array<string>;

  @prop({required: true})
  public number!: number;

  @prop({required: true})
  public name!: string;

}


export type Relation = RelationSchema;
export const RelationModel = getModelForClass(RelationSchema);