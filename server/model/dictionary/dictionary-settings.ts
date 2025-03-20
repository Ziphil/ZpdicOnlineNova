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

  @prop()
  public ignoredEquivalentPattern?: string;

  @prop({required: true})
  public pronunciationTitle!: string;

  @prop({required: true})
  public exampleTitle!: string;

  @prop({required: true})
  public enableMarkdown!: boolean;

  @prop({required: true})
  public enableDuplicateName!: boolean;

  @prop({required: true})
  public showEquivalentNumber!: boolean;

  public static createDefault(): DictionarySettings {
    const font = {type: "none"};
    const punctuations = [",", "、", "。"];
    const ignoredEquivalentPattern = "[\\(（].*?[\\)）]";
    const pronunciationTitle = "Pronunciation";
    const exampleTitle = "Examples";
    const enableMarkdown = false;
    const enableDuplicateName = true;
    const showEquivalentNumber = false;
    const settings = new DictionarySettingsModel({font, punctuations, ignoredEquivalentPattern, pronunciationTitle, exampleTitle, enableMarkdown, enableDuplicateName, showEquivalentNumber});
    return settings;
  }

}


export type DictionarySettings = DictionarySettingsSchema;
export const DictionarySettingsModel = getModelForClass(DictionarySettingsSchema);