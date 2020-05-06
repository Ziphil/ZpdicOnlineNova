//

import {
  DocumentType,
  getModelForClass,
  prop
} from "@hasezoey/typegoose";


export class ResetToken {

  @prop({required: true})
  public name!: string;

  @prop({required: true})
  public hash!: string;

  @prop({required: true})
  public date!: Date;

}


export type ResetTokenDocument = DocumentType<ResetToken>;
export let ResetTokenModel = getModelForClass(ResetToken);