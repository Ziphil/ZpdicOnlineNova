//

import {
  DocumentType,
  arrayProp,
  getModelForClass,
  prop
} from "@hasezoey/typegoose";
import {
  EquivalentSkeleton
} from "/server/skeleton/dictionary";


export class Equivalent {

  @prop({required: true})
  public title!: string;

  @arrayProp({required: true, items: String})
  public names!: Array<string>;

}


export class EquivalentCreator {

  public static create(raw: Equivalent): EquivalentSkeleton {
    let title = raw.title;
    let names = raw.names;
    let skeleton = EquivalentSkeleton.of({title, names});
    return skeleton;
  }

}


export type EquivalentDocument = DocumentType<Equivalent>;
export let EquivalentModel = getModelForClass(Equivalent);