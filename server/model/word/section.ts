//

import {
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import {WORD_LIMITS} from "/server/model/constant";
import {EquivalentSchema} from "/server/model/word/equivalent";
import {InformationSchema} from "/server/model/word/information";
import {PhraseSchema} from "/server/model/word/phrase";
import {RelationSchema} from "/server/model/word/relation";
import {VariationSchema} from "/server/model/word/variation";
import {createMaxCountValidator} from "/server/util/validation";


@modelOptions({schemaOptions: {autoCreate: false, collection: "sections"}})
export class SectionSchema {

  @prop({required: true, type: EquivalentSchema, outerOptions: {validate: createMaxCountValidator(WORD_LIMITS.equivalentCountPerSection)}})
  public equivalents!: Array<EquivalentSchema>;

  @prop({required: true, type: InformationSchema, outerOptions: {validate: createMaxCountValidator(WORD_LIMITS.informationCountPerSection)}})
  public informations!: Array<InformationSchema>;

  @prop({type: PhraseSchema, outerOptions: {validate: createMaxCountValidator(WORD_LIMITS.phraseCountPerSection)}})
  public phrases?: Array<PhraseSchema>;

  @prop({required: true, type: VariationSchema, outerOptions: {validate: createMaxCountValidator(WORD_LIMITS.variationCountPerSection)}})
  public variations!: Array<VariationSchema>;

  @prop({required: true, type: RelationSchema, outerOptions: {validate: createMaxCountValidator(WORD_LIMITS.relationCountPerSection)}})
  public relations!: Array<RelationSchema>;

}


export type Section = SectionSchema;
export const SectionModel = getModelForClass(SectionSchema);