//

import {getModelForClass, modelOptions, prop} from "@typegoose/typegoose";
import {DICTIONARY_LIMITS} from "/server/model/constant";


@modelOptions({schemaOptions: {autoCreate: false, collection: "informations"}})
export class InformationSchema {

  @prop({required: true, maxlength: DICTIONARY_LIMITS.word.informationTitleLength})
  public title!: string;

  @prop({required: true, maxlength: DICTIONARY_LIMITS.word.informationTextLength})
  public text!: string;

  @prop()
  public hidden?: boolean;

}


export type Information = InformationSchema;
export const InformationModel = getModelForClass(InformationSchema);