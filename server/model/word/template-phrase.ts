//

import {getModelForClass, modelOptions, prop} from "@typegoose/typegoose";


@modelOptions({schemaOptions: {autoCreate: false, collection: "templatePhrases"}})
export class TemplatePhraseSchema {

  @prop({required: true, type: String})
  public titles!: Array<string>;

  @prop({required: true})
  public form!: string;

  @prop({required: true})
  public termString!: string;

  @prop()
  public ignoredPattern?: string;

}


export type TemplatePhrase = TemplatePhraseSchema;
export const TemplatePhraseModel = getModelForClass(TemplatePhraseSchema);