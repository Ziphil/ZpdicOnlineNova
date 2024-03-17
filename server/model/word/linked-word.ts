//

import {getModelForClass, prop} from "@typegoose/typegoose";


export class LinkedWordSchema {

  @prop({required: true})
  public number!: number;

}


export type LinkedWord = LinkedWordSchema;
export const LinkedWordModel = getModelForClass(LinkedWordSchema);