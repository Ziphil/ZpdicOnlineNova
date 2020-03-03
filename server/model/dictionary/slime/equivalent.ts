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


export class SlimeEquivalentSkeleton {

  public title: string;
  public names: Array<String>;

  public constructor(equivalent: SlimeEquivalent) {
    this.title = equivalent.title;
    this.names = equivalent.names;
  }

}


export type SlimeEquivalentDocument = DocumentType<SlimeEquivalent>;
export let SlimeEquivalentModel = getModelForClass(SlimeEquivalent);