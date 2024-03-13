//

import {getModelForClass, prop} from "@typegoose/typegoose";
import type {
  LinkedWord as LinkedWordSkeleton
} from "/client/skeleton";


export class LinkedWordSchema {

  @prop({required: true})
  public number!: number;

}


export class LinkedWordCreator {

  public static create(raw: LinkedWord): LinkedWordSkeleton {
    const number = raw.number;
    const skeleton = {number};
    return skeleton;
  }

}


export type LinkedWord = LinkedWordSchema;
export const LinkedWordModel = getModelForClass(LinkedWordSchema);