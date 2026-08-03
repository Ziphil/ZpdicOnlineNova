//

import {getModelForClass, modelOptions, prop} from "@typegoose/typegoose";
import {WORD_LIMITS} from "/server/model/constant";
import {TemplateEquivalentSchema} from "/server/model/template-word/template-equivalent";
import {TemplatePhraseSchema} from "/server/model/template-word/template-phrase";
import {TemplateRelationSchema} from "/server/model/template-word/template-relation";
import {InformationSchema} from "/server/model/word/information";
import {VariationSchema} from "/server/model/word/variation";
import {createMaxCountValidator} from "/server/util/validation";


@modelOptions({schemaOptions: {autoCreate: false, collection: "templateSections"}})
export class TemplateSectionSchema {

  @prop({required: true, type: TemplateEquivalentSchema, outerOptions: {validate: createMaxCountValidator(WORD_LIMITS.equivalentCountPerSection)}})
  public equivalents!: Array<TemplateEquivalentSchema>;

  @prop({required: true, type: InformationSchema, outerOptions: {validate: createMaxCountValidator(WORD_LIMITS.informationCountPerSection)}})
  public informations!: Array<InformationSchema>;

  @prop({required: true, type: TemplatePhraseSchema, outerOptions: {validate: createMaxCountValidator(WORD_LIMITS.phraseCountPerSection)}})
  public phrases!: Array<TemplatePhraseSchema>;

  @prop({required: true, type: VariationSchema, outerOptions: {validate: createMaxCountValidator(WORD_LIMITS.variationCountPerSection)}})
  public variations!: Array<VariationSchema>;

  @prop({required: true, type: TemplateRelationSchema, outerOptions: {validate: createMaxCountValidator(WORD_LIMITS.relationCountPerSection)}})
  public relations!: Array<TemplateRelationSchema>;

}


export type TemplateSection = TemplateSectionSchema;
export const TemplateSectionModel = getModelForClass(TemplateSectionSchema);
