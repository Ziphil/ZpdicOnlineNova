//

import {getModelForClass, modelOptions, prop} from "@typegoose/typegoose";
import {InformationSchema} from "/server/model/word/information";
import {PhraseSchema} from "/server/model/word/phrase";
import {TemplateEquivalentSchema} from "/server/model/word/template-equivalent";
import {TemplateRelationSchema} from "/server/model/word/template-relation";
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

  @prop({required: true, type: PhraseSchema})
  public phrases!: Array<PhraseSchema>;

  @prop({required: true, type: VariationSchema})
  public variations!: Array<VariationSchema>;

  @prop({required: true, type: TemplateRelationSchema})
  public relations!: Array<TemplateRelationSchema>;

}


export type TemplateWord = TemplateWordSchema;
export const TemplateWordModel = getModelForClass(TemplateWordSchema);
