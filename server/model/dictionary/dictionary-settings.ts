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
  public enableMarkdown!: boolean;

  public static createDefault(): DictionarySettings {
    let settings = new DictionarySettingsModel({});
    settings.punctuations = [",", "、"];
    settings.pronunciationTitle = "pronunciation";
    settings.enableMarkdown = false;
    return settings;
  }

}


export class DictionarySettingsCreator {

  public static create(raw: DictionarySettings): DictionarySettingsSkeleton {
    let akrantiainSource = raw.akrantiainSource;
    let zatlinSource = raw.zatlinSource;
    let punctuations = raw.punctuations;
    let pronunciationTitle = raw.pronunciationTitle;
    let enableMarkdown = raw.enableMarkdown;
    let skeleton = {akrantiainSource, zatlinSource, punctuations, pronunciationTitle, enableMarkdown};
    return skeleton;
  }

}


export type DictionarySettings = DictionarySettingsSchema;
export let DictionarySettingsModel = getModelForClass(DictionarySettingsSchema);