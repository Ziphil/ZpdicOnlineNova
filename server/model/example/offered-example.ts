//

import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import dayjs from "dayjs";


@modelOptions({schemaOptions: {collection: "offeredExamples"}})
export class OfferedExampleSchema {

  @prop({required: true})
  public path!: string;

  @prop({required: true})
  public translation!: string;

  @prop({required: true})
  public createdDate!: Date;

  public static async addDaily(): Promise<OfferedExample> {
    const translation = "これはテストの例文です。";
    const createdDate = new Date();
    const path = `daily/${dayjs().tz("Asia/Tokyo").format("YYYYMMDD")}`;
    const example = new OfferedExampleModel({path, translation, createdDate});
    await example.save();
    return example;
  }

}


export type OfferedExample = DocumentType<OfferedExampleSchema>;
export const OfferedExampleModel = getModelForClass(OfferedExampleSchema);