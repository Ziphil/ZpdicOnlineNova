//

import {getModelForClass, modelOptions, prop} from "@typegoose/typegoose";
import {EquivalentSchema} from "/server/model/word/equivalent";
import {InformationSchema} from "/server/model/word/information";
import {RelationSchema} from "/server/model/word/relation";
import {VariationSchema} from "/server/model/word/variation";


@modelOptions({schemaOptions: {autoCreate: false, collection: "templateWords"}})
export class TemplateWordSchema {

  @prop({required: true})
  public title!: string;

  @prop({required: true})
  public name!: string;

  @prop({required: true})
  public pronunciation!: string;

  @prop({required: true, type: EquivalentSchema})
  public equivalents!: Array<EquivalentSchema>;

  @prop({required: true, type: String})
  public tags!: Array<string>;

  @prop({required: true, type: InformationSchema})
  public informations!: Array<InformationSchema>;

  @prop({required: true, type: VariationSchema})
  public variations!: Array<VariationSchema>;

  @prop({required: true, type: RelationSchema})
  public relations!: Array<RelationSchema>;

}


export type TemplateWord = TemplateWordSchema;
export const TemplateWordModel = getModelForClass(TemplateWordSchema);
