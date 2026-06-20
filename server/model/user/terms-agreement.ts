//

import {getModelForClass, modelOptions, prop} from "@typegoose/typegoose";


@modelOptions({schemaOptions: {autoCreate: false, collection: "termsAgreements"}})
export class TermsAgreementSchema {

  @prop({required: true})
  public version!: number;

  @prop({required: true})
  public date!: Date;

}


export type TermsAgreement = TermsAgreementSchema;
export const TermsAgreementModel = getModelForClass(TermsAgreementSchema);
