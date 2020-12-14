//

import {
  getModelForClass,
  prop
} from "@typegoose/typegoose";
import {
  LinkedWord as LinkedWordSkeleton
} from "/client/skeleton/dictionary";


export class LinkedWordSchema {

  @prop({required: true})
  public number!: number;

  public name?: string;

}


export class LinkedWordCreator {

  public static create(raw: LinkedWord): LinkedWordSkeleton {
    let number = raw.number;
    let name = raw.name;
    let skeleton = {number, name};
    return skeleton;
  }

}


export type LinkedWord = LinkedWordSchema;
export let LinkedWordModel = getModelForClass(LinkedWordSchema);