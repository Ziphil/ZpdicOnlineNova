//

import {
  getModelForClass,
  prop
} from "@typegoose/typegoose";


export class ResetTokenSchema {

  @prop({required: true})
  public name!: string;

  @prop({required: true})
  public hash!: string;

  @prop({required: true})
  public date!: Date;

}


export type ResetToken = ResetTokenSchema;
export let ResetTokenModel = getModelForClass(ResetTokenSchema);