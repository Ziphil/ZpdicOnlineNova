//

import {getModelForClass, modelOptions, prop} from "@typegoose/typegoose";
import {DictionaryFontSchema} from "/server/model/dictionary/dictionary-font";


@modelOptions({schemaOptions: {autoCreate: false, collection: "dictionarySettings"}})
export class DictionarySettingsSchema {

  @prop()
  public akrantiainSource?: string;

  @prop()
  public zatlinSource?: string;

  @prop()
  public font?: DictionaryFontSchema;

  @prop({required: true, type: String})
  public punctuations!: Array<string>;

  @prop({required: true})
  public pronunciationTitle!: string;

  @prop({required: true})
  public exampleTitle!: string;

  @prop({required: true})
  public enableMarkdown!: boolean;

  @prop({required: true})
  public enableDuplicateName!: boolean;

  public static createDefault(): DictionarySettings {
    const font = {type: "none"};
    const punctuations = [",", "、"];
    const pronunciationTitle = "Pronunciation";
    const exampleTitle = "Examples";
    const enableMarkdown = false;
    const enableDuplicateName = true;
    const settings = new DictionarySettingsModel({font, punctuations, pronunciationTitle, exampleTitle, enableMarkdown, enableDuplicateName});
    return settings;
  }

}


export type DictionarySettings = DictionarySettingsSchema;
export const DictionarySettingsModel = getModelForClass(DictionarySettingsSchema);