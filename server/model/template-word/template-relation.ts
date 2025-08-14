//

import {getModelForClass, modelOptions, prop} from "@typegoose/typegoose";


@modelOptions({schemaOptions: {autoCreate: false, collection: "templateRelations"}})
export class TemplateRelationSchema {

  @prop({required: true, type: String})
  public titles!: Array<string>;

}


export type TemplateRelation = TemplateRelationSchema;
export const TemplateRelationModel = getModelForClass(TemplateRelationSchema);
