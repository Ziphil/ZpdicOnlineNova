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

  @prop({type: String})
  public markdownFeatures?: Array<string>;

  @prop()
  public enableAdvancedWord?: boolean;

  @prop()
  public enableProposal?: boolean;

  @prop({required: true})
  public enableDuplicateName!: boolean;

  @prop()
  public showVariationPronunciation?: boolean;

  @prop({required: true})
  public showEquivalentNumber!: boolean;

  @prop()
  public showSectionNumber?: boolean;

  public static createDefault(): DictionarySettings {
    const settings = new DictionarySettingsModel({
      font: new DictionaryFontModel({kind: "none"}),
      punctuations: [",", "、", "。"],
      ignoredEquivalentPattern: "[\\(（].*?[\\)）]",
      pronunciationTitle: "発音",
      phraseTitle: "成句",
      exampleTitle: "例文",
      markdownFeatures: [],
      enableAdvancedWord: false,
      enableProposal: true,
      enableDuplicateName: true,
      showVariationPronunciation: true,
      showEquivalentNumber: false,
      showSectionNumber: true
    });
    return settings;
  }

}


export type DictionarySettings = DictionarySettingsSchema;
export const DictionarySettingsModel = getModelForClass(DictionarySettingsSchema);