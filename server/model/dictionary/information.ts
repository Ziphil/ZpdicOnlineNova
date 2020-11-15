//

import {
  getModelForClass,
  prop
} from "@typegoose/typegoose";
import {
  Information as InformationSkeleton
} from "/client/skeleton/dictionary";


export class InformationSchema {

  @prop({required: true})
  public title!: string;

  @prop({required: true})
  public text!: string;

}


export class InformationCreator {

  public static create(raw: Information): InformationSkeleton {
    let title = raw.title;
    let text = raw.text;
    let skeleton = {title, text};
    return skeleton;
  }

}


export type Information = InformationSchema;
export let InformationModel = getModelForClass(InformationSchema);