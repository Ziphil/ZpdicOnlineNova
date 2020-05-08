//

import {
  DocumentType,
  getModelForClass,
  prop
} from "@hasezoey/typegoose";


export class Information {

  @prop({required: true})
  public title!: string;

  @prop({required: true})
  public text!: string;

}


export type InformationDocument = DocumentType<Information>;
export let InformationModel = getModelForClass(Information);