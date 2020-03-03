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


export class SlimeInformationSkeleton {

  public title: string;
  public text: string;

  public constructor(information: SlimeInformation) {
    this.title = information.title;
    this.text = information.text;
  }

}


export type SlimeInformationDocument = DocumentType<SlimeInformation>;
export let SlimeInformationModel = getModelForClass(SlimeInformation);