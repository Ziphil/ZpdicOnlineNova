//

import {getModelForClass, modelOptions, prop} from "@typegoose/typegoose";


@modelOptions({schemaOptions: {autoCreate: false, collection: "phrases"}})
export class PhraseSchema {

  @prop({required: true, type: String})
  public titles!: Array<string>;

  @prop({required: true})
  public form!: string;

  @prop({required: true})
  public translations!: Array<string>;

}


export type Phrase = PhraseSchema;
export const PhraseModel = getModelForClass(PhraseSchema);