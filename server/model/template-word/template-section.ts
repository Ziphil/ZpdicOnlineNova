//

import {getModelForClass, modelOptions, prop} from "@typegoose/typegoose";
import {TemplateEquivalentSchema} from "/server/model/template-word/template-equivalent";
import {TemplatePhraseSchema} from "/server/model/template-word/template-phrase";
import {TemplateRelationSchema} from "/server/model/template-word/template-relation";
import {InformationSchema} from "/server/model/word/information";
import {VariationSchema} from "/server/model/word/variation";


@modelOptions({schemaOptions: {autoCreate: false, collection: "templateSections"}})
export class TemplateSectionSchema {

  @prop({required: true, type: TemplateEquivalentSchema})
  public equivalents!: Array<TemplateEquivalentSchema>;

  @prop({required: true, type: InformationSchema})
  public informations!: Array<InformationSchema>;

  @prop({required: true, type: TemplatePhraseSchema})
  public phrases!: Array<TemplatePhraseSchema>;

  @prop({required: true, type: VariationSchema})
  public variations!: Array<VariationSchema>;

  @prop({required: true, type: TemplateRelationSchema})
  public relations!: Array<TemplateRelationSchema>;

}


export type TemplateSection = TemplateSectionSchema;
export const TemplateSectionModel = getModelForClass(TemplateSectionSchema);
