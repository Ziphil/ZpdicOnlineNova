//

import {getModelForClass, modelOptions, prop} from "@typegoose/typegoose";


@modelOptions({schemaOptions: {autoCreate: false, collection: "templateEquivalents"}})
export class TemplateEquivalentSchema {

  @prop({required: true, type: String})
  public titles!: Array<string>;

  @prop({required: true})
  public nameString!: string;

}


export type TemplateEquivalent = TemplateEquivalentSchema;
export const TemplateEquivalentModel = getModelForClass(TemplateEquivalentSchema);