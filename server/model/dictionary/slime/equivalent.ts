//

import {
  DocumentType,
  arrayProp,
  getModelForClass,
  prop
} from "@hasezoey/typegoose";


export class SlimeEquivalent {

  @prop({required: true})
  public title!: string;

  @arrayProp({required: true, items: String})
  public names!: Array<string>;

}


export type SlimeEquivalentDocument = DocumentType<SlimeEquivalent>;
export let SlimeEquivalentModel = getModelForClass(SlimeEquivalent);