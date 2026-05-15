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

  @prop({required: true})
  public dailyExampleOfferSpecs!: any;

}


export type System = DocumentType<SystemSchema>;
export const SystemModel = getModelForClass(SystemSchema);