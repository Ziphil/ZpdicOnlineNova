//

import {getModelForClass, prop} from "@typegoose/typegoose";


export class InformationSchema {

  @prop({required: true})
  public title!: string;

  @prop({required: true})
  public text!: string;

}


export type Information = InformationSchema;
export const InformationModel = getModelForClass(InformationSchema);