//

import {getModelForClass, modelOptions, prop} from "@typegoose/typegoose";


@modelOptions({schemaOptions: {autoCreate: false, collection: "equivalents"}})
export class EquivalentSchema {

  @prop({required: true, type: String})
  public titles!: Array<string>;

  @prop({required: true, type: String})
  public names!: Array<string>;

  @prop()
  public nameString?: string;

  @prop()
  public ignoredPattern?: string;

  @prop()
  public hidden?: boolean;

}


export type Equivalent = EquivalentSchema;
export const EquivalentModel = getModelForClass(EquivalentSchema);