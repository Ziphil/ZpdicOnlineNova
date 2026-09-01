//

import {getModelForClass, modelOptions, prop} from "@typegoose/typegoose";
import {Jsonify} from "jsonify-type";
import {TEMPLATE_WORD_LIMITS, WORD_LIMITS} from "/server/model/constant";
import {TemplateSectionSchema} from "/server/model/template-word/template-section";
import {createMaxCountValidator} from "/server/util/validation";


@modelOptions({schemaOptions: {autoCreate: false, collection: "templateWords"}})
export class TemplateWordSchema {

  @prop({required: true, maxlength: TEMPLATE_WORD_LIMITS.titleLength})
  public title!: string;

  @prop({required: true, maxlength: WORD_LIMITS.spellingLength})
  public name!: string;

  @prop({required: true, maxlength: WORD_LIMITS.pronunciationLength})
  public pronunciation!: string;

  @prop({required: true, type: String, innerOptions: {maxlength: WORD_LIMITS.tagLength}, outerOptions: {validate: createMaxCountValidator(WORD_LIMITS.tagCount)}})
  public tags!: Array<string>;

  @prop({required: true, type: TemplateSectionSchema, outerOptions: {validate: createMaxCountValidator(WORD_LIMITS.sectionCount)}})
  public sections!: Array<TemplateSectionSchema>;

}


export type TemplateWord = TemplateWordSchema;
export const TemplateWordModel = getModelForClass(TemplateWordSchema);

export type EditableTemplateWord = Pick<Jsonify<TemplateWord>, "title" | "name" | "pronunciation" | "tags" | "sections"> & {id: string | null};