//

import {getModelForClass, modelOptions, prop} from "@typegoose/typegoose";


@modelOptions({schemaOptions: {autoCreate: false, collection: "informations"}})
export class InformationSchema {

  @prop({required: true})
  public title!: string;

  @prop({required: true})
  public text!: string;

  @prop()
  public hidden?: boolean;

}


export type Information = InformationSchema;
export const InformationModel = getModelForClass(InformationSchema);