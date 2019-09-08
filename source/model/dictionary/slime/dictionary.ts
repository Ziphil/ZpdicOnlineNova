//

import {
  DocumentType,
  Ref,
  getModelForClass,
  prop
} from "@hasezoey/typegoose";
import {
  User
} from "../../user";


export class SlimeDictionary {

  @prop({required: true, unique: true})
  public number!: number;

  @prop({required: true})
  public status!: string;

  @prop({required: true})
  public name!: string;

  @prop({required: true, ref: User})
  public user!: Ref<User>;

  @prop({required: true})
  public externalData!: object;

}


export type SlimeDictionaryDocument = DocumentType<SlimeDictionary>;
export let SlimeDictionaryModel = getModelForClass(SlimeDictionary);