//

import {getModelForClass, modelOptions, prop} from "@typegoose/typegoose";


@modelOptions({schemaOptions: {autoCreate: false, collection: "linkedWords"}})
export class LinkedWordSchema {

  @prop({required: true})
  public number!: number;

}


export type LinkedWord = LinkedWordSchema;
export const LinkedWordModel = getModelForClass(LinkedWordSchema);