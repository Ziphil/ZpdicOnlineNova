//

import {getModelForClass, modelOptions, prop} from "@typegoose/typegoose";
import {TemplateEquivalentSchema} from "/server/model/template-word/template-equivalent";
import {TemplatePhraseSchema} from "/server/model/template-word/template-phrase";
import {TemplateRelationSchema} from "/server/model/template-word/template-relation";
import {InformationSchema} from "/server/model/word/information";
import {VariationSchema} from "/server/model/word/variation";


@modelOptions({schemaOptions: {autoCreate: false, collection: "templateWords"}})
export class TemplateWordSchema {

  @prop({required: true})
  public title!: string;

  @prop({required: true})
  public name!: string;

  @prop({required: true})
  public pronunciation!: string;

  @prop({required: true, type: TemplateEquivalentSchema})
  public equivalents!: Array<TemplateEquivalentSchema>;

  @prop({required: true, type: String})
  public tags!: Array<string>;

  @prop({required: true, type: InformationSchema})
  public informations!: Array<InformationSchema>;

  @prop({required: true, type: TemplatePhraseSchema})
  public phrases!: Array<TemplatePhraseSchema>;

  @prop({required: true, type: VariationSchema})
  public variations!: Array<VariationSchema>;

  @prop({required: true, type: TemplateRelationSchema})
  public relations!: Array<TemplateRelationSchema>;

}


export type TemplateWord = TemplateWordSchema;
export const TemplateWordModel = getModelForClass(TemplateWordSchema);
