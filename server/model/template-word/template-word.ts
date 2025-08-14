//

import {getModelForClass, modelOptions, prop} from "@typegoose/typegoose";
import {Jsonify} from "jsonify-type";
import {TemplateSectionSchema} from "/server/model/template-word/template-section";


@modelOptions({schemaOptions: {autoCreate: false, collection: "templateWords"}})
export class TemplateWordSchema {

  @prop({required: true})
  public title!: string;

  @prop({required: true})
  public name!: string;

  @prop({required: true})
  public pronunciation!: string;

  @prop({required: true, type: String})
  public tags!: Array<string>;

  @prop({required: true, type: TemplateSectionSchema})
  public sections!: Array<TemplateSectionSchema>;

}


export type TemplateWord = TemplateWordSchema;
export const TemplateWordModel = getModelForClass(TemplateWordSchema);

export type EditableTemplateWord = Pick<Jsonify<TemplateWord>, "title" | "name" | "pronunciation" | "tags" | "sections"> & {id: string | null};