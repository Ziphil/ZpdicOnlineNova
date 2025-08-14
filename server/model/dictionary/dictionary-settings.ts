//

import {getModelForClass, modelOptions, prop} from "@typegoose/typegoose";
import {DictionaryFontModel, DictionaryFontSchema} from "/server/model/dictionary/dictionary-font";
import {TemplateWordSchema} from "/server/model/template-word/template-word";


@modelOptions({schemaOptions: {autoCreate: false, collection: "dictionarySettings"}})
export class DictionarySettingsSchema {

  @prop()
  public akrantiainSource?: string;

  @prop()
  public zatlinSource?: string;

  @prop()
  public font?: DictionaryFontSchema;

  @prop({type: TemplateWordSchema})
  public templateWords?: Array<TemplateWordSchema>;

  @prop({required: true, type: String})
  public punctuations!: Array<string>;

  @prop()
  public ignoredEquivalentPattern?: string;

  @prop({required: true})
  public pronunciationTitle!: string;

  @prop()
  public phraseTitle?: string;

  @prop({required: true})
  public exampleTitle!: string;

  @prop()
  public enableAdvancedWord?: boolean;

  @prop({required: true})
  public enableMarkdown!: boolean;

  @prop({required: true})
  public enableDuplicateName!: boolean;

  @prop({required: true})
  public showEquivalentNumber!: boolean;

  public static createDefault(): DictionarySettings {
    const font = new DictionaryFontModel({kind: "none"});
    const punctuations = [",", "、", "。"];
    const ignoredEquivalentPattern = "[\\(（].*?[\\)）]";
    const pronunciationTitle = "発音";
    const phraseTitle = "成句";
    const exampleTitle = "例文";
    const enableAdvancedWord = false;
    const enableMarkdown = false;
    const enableDuplicateName = true;
    const showEquivalentNumber = false;
    const settings = new DictionarySettingsModel({font, punctuations, ignoredEquivalentPattern, pronunciationTitle, phraseTitle, exampleTitle, enableAdvancedWord, enableMarkdown, enableDuplicateName, showEquivalentNumber});
    return settings;
  }

}


export type DictionarySettings = DictionarySettingsSchema;
export const DictionarySettingsModel = getModelForClass(DictionarySettingsSchema);