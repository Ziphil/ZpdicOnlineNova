//

import {
  getModelForClass,
  prop
} from "@typegoose/typegoose";
import {
  DictionarySettings as DictionarySettingsSkeleton
} from "/client/skeleton/dictionary";


export class DictionarySettingsSchema {

  @prop()
  public akrantiainSource?: string;

  @prop()
  public zatlinSource?: string;

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
    const punctuations = [",", "、"];
    const pronunciationTitle = "Pronunciation";
    const exampleTitle = "Examples";
    const enableMarkdown = false;
    const settings = new DictionarySettingsModel({punctuations, pronunciationTitle, exampleTitle, enableMarkdown});
    return settings;
  }

}


export class DictionarySettingsCreator {

  public static create(raw: DictionarySettings): DictionarySettingsSkeleton {
    const akrantiainSource = raw.akrantiainSource;
    const zatlinSource = raw.zatlinSource;
    const punctuations = raw.punctuations;
    const pronunciationTitle = raw.pronunciationTitle;
    const exampleTitle = raw.exampleTitle;
    const enableMarkdown = raw.enableMarkdown;
    const enableDuplicateName = raw.enableDuplicateName;
    const skeleton = {akrantiainSource, zatlinSource, punctuations, pronunciationTitle, exampleTitle, enableMarkdown, enableDuplicateName};
    return skeleton;
  }

}


export type DictionarySettings = DictionarySettingsSchema;
export const DictionarySettingsModel = getModelForClass(DictionarySettingsSchema);