//

import {
  DocumentType,
  Ref,
  arrayProp,
  getModelForClass,
  prop
} from "@hasezoey/typegoose";
import {
  Dictionary,
  Equivalent,
  Information,
  Relation,
  Variation
} from "/server/model/dictionary";


export class Word {

  @prop({required: true, ref: Dictionary})
  public dictionary!: Ref<Dictionary>;

  @prop({required: true})
  public number!: number;

  @prop({required: true})
  public name!: string;

  @arrayProp({required: true, items: Equivalent})
  public equivalents!: Array<Equivalent>;

  @arrayProp({required: true, items: String})
  public tags!: Array<string>;

  @arrayProp({required: true, items: Information})
  public informations!: Array<Information>;

  @arrayProp({required: true, items: Variation})
  public variations!: Array<Variation>;

  @arrayProp({required: true, items: Relation})
  public relations!: Array<Relation>;

}


export type WordDocument = DocumentType<Word>;
export let WordModel = getModelForClass(Word);