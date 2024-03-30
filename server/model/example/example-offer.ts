//

import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import dayjs from "dayjs";
import {WithSize} from "/server/type/common";
import {QueryRange} from "/server/util/query";


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

  public static async fetch(range?: QueryRange): Promise<WithSize<ExampleOffer>> {
    const query = ExampleOfferModel.find().sort("-createdDate");
    const result = await QueryRange.restrictWithSize(query, range);
    return result;
  }

}


export type ExampleOffer = DocumentType<ExampleOfferSchema>;
export const ExampleOfferModel = getModelForClass(ExampleOfferSchema);