//

import {getModelForClass, modelOptions, prop} from "@typegoose/typegoose";
import {DictionaryFontModel, DictionaryFontSchema} from "/server/model/dictionary/dictionary-font";
import {TemplateWordSchema} from "/server/model/template-word/template-word";
import {LiteralType, LiteralUtilType} from "/server/util/literal-type";


export const DICTIONARY_NUMBER_MODES = ["show", "onlyNecessary", "hide"] as const;
export type DictionaryNumberMode = LiteralType<typeof DICTIONARY_NUMBER_MODES>;
export const DictionaryNumberModeUtil = LiteralUtilType.create(DICTIONARY_NUMBER_MODES);


@modelOptions({schemaOptions: {autoCreate: false, collection: "dictionarySettings"}})
export class DictionarySettingsSchema {

  @prop()
  public akrantiainSource?: string;

  @prop()
  public zatlinSource?: string;

  @prop()
  public font?: DictionaryFontSchema;

  @prop({type: String})
  public fontTargets?: Array<string>;

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

  @prop()
  public showOrdinarySpelling?: boolean;

  @prop({required: true, enum: DICTIONARY_NUMBER_MODES})
  public showEquivalentNumber!: DictionaryNumberMode;

  @prop({enum: DICTIONARY_NUMBER_MODES})
  public showSectionNumber?: DictionaryNumberMode;

  public static createDefault(): DictionarySettings {
    const settings = new DictionarySettingsModel({
      font: new DictionaryFontModel({kind: "none"}),
      fontTargets: ["heading", "text"],
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
      showOrdinarySpelling: false,
      showEquivalentNumber: "hide",
      showSectionNumber: "show"
    });
    return settings;
  }

}


export type DictionarySettings = DictionarySettingsSchema;
export const DictionarySettingsModel = getModelForClass(DictionarySettingsSchema);