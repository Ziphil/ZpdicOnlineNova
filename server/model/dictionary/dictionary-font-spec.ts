//

import {modelOptions, prop} from "@typegoose/typegoose";


@modelOptions({schemaOptions: {discriminatorKey: "type"}})
export class DictionaryFontSpecSchema {

  @prop({required: true})
  public type!: string;

  @prop()
  public name?: string;

  @prop()
  public format?: string;

}


export type DictionaryFontSpec = DictionaryFontSpecSchema;