//

import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import dayjs from "dayjs";


@modelOptions({schemaOptions: {collection: "exampleOffer"}})
export class ExampleOfferSchema {

  @prop({required: true})
  public path!: string;

  @prop({required: true})
  public translation!: string;

  @prop({required: true})
  public createdDate!: Date;

  public static async addDaily(): Promise<ExampleOffer> {
    const translation = "これはテストの例文です。";
    const createdDate = new Date();
    const path = `daily/${dayjs().tz("Asia/Tokyo").format("YYYYMMDD")}`;
    const offer = new ExampleOfferModel({path, translation, createdDate});
    await offer.save();
    return offer;
  }

}


export type ExampleOffer = DocumentType<ExampleOfferSchema>;
export const ExampleOfferModel = getModelForClass(ExampleOfferSchema);