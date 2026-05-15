//

import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";


@modelOptions({schemaOptions: {collection: "system"}})
export class SystemSchema {

  @prop({required: true})
  public dailyExampleOfferUserPrompt!: string;

  @prop({required: true})
  public dailyExampleOfferSystemPrompt!: string;

}


export type System = DocumentType<SystemSchema>;
export const SystemModel = getModelForClass(SystemSchema);