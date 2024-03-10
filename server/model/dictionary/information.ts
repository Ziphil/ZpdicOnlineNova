//

import {
  getModelForClass,
  prop
} from "@typegoose/typegoose";
import {
  Information as InformationSkeleton
} from "/client-new/skeleton";


export class InformationSchema {

  @prop({required: true})
  public title!: string;

  @prop({required: true})
  public text!: string;

}


export class InformationCreator {

  public static create(raw: Information): InformationSkeleton {
    const title = raw.title;
    const text = raw.text;
    const skeleton = {title, text};
    return skeleton;
  }

}


export type Information = InformationSchema;
export const InformationModel = getModelForClass(InformationSchema);