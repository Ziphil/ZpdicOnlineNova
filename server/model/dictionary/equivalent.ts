//

import {
  DocumentType,
  arrayProp,
  getModelForClass,
  prop
} from "@hasezoey/typegoose";


export class Equivalent {

  @prop({required: true})
  public title!: string;

  @arrayProp({required: true, items: String})
  public names!: Array<string>;

}


export type EquivalentDocument = DocumentType<Equivalent>;
export let EquivalentModel = getModelForClass(Equivalent);