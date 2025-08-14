//

import {
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import {EquivalentSchema} from "/server/model/word/equivalent";
import {InformationSchema} from "/server/model/word/information";
import {PhraseSchema} from "/server/model/word/phrase";
import {RelationSchema} from "/server/model/word/relation";
import {VariationSchema} from "/server/model/word/variation";


@modelOptions({schemaOptions: {autoCreate: false, collection: "sections"}})
export class SectionSchema {

  @prop({required: true, type: EquivalentSchema})
  public equivalents!: Array<EquivalentSchema>;

  @prop({required: true, type: InformationSchema})
  public informations!: Array<InformationSchema>;

  @prop({type: PhraseSchema})
  public phrases?: Array<PhraseSchema>;

  @prop({required: true, type: VariationSchema})
  public variations!: Array<VariationSchema>;

  @prop({required: true, type: RelationSchema})
  public relations!: Array<RelationSchema>;

}


export type Section = SectionSchema;
export const SectionModel = getModelForClass(SectionSchema);