//

import {
  DocumentType,
  getModelForClass,
  prop
} from "@hasezoey/typegoose";


export class SlimeInformation {

  @prop({required: true})
  public title!: string;

  @prop({required: true})
  public text!: string;

}


export type SlimeInformationDocument = DocumentType<SlimeInformation>;
export let SlimeInformationModel = getModelForClass(SlimeInformation);