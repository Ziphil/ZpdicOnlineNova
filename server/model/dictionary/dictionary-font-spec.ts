//

import {modelOptions, prop} from "@typegoose/typegoose";


@modelOptions({schemaOptions: {discriminatorKey: "type"}})
export class DictionaryFontSpecSchema {

  @prop({required: true})
  public type!: string;

}


export class DictionaryFontNoneSpecSchema extends DictionaryFontSpecSchema {

}


export class DictionaryFontLocalSpecSchema extends DictionaryFontSpecSchema {

  @prop({required: true})
  public name!: string;

}


export class DictionaryFontCustomSpecSchema extends DictionaryFontSpecSchema {

  @prop({required: true})
  public format!: string;

}