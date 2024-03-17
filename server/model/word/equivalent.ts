//

import {getModelForClass, prop} from "@typegoose/typegoose";


export class EquivalentSchema {

  @prop({required: true, type: String})
  public titles!: Array<string>;

  @prop({required: true, type: String})
  public names!: Array<string>;

}


export type Equivalent = EquivalentSchema;
export const EquivalentModel = getModelForClass(EquivalentSchema);