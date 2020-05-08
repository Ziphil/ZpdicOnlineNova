//

import {
  DocumentType,
  getModelForClass,
  prop
} from "@hasezoey/typegoose";
import {
  InformationSkeleton
} from "/server/skeleton/dictionary";


export class Information {

  @prop({required: true})
  public title!: string;

  @prop({required: true})
  public text!: string;

}


export class InformationCreator {

  public static create(raw: Information): InformationSkeleton {
    let title = raw.title;
    let text = raw.text;
    let skeleton = InformationSkeleton.of({title, text});
    return skeleton;
  }

}


export type InformationDocument = DocumentType<Information>;
export let InformationModel = getModelForClass(Information);