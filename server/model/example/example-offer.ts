//

import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import {ExampleOfferPositionSchema} from "/server/model/example/example-offer-position";
import {WithSize} from "/server/type/common";
import {QueryRange} from "/server/util/query";


@modelOptions({schemaOptions: {collection: "exampleOffers"}})
export class ExampleOfferSchema {

  @prop({required: true})
  public position!: ExampleOfferPositionSchema;

  @prop({required: true})
  public translation!: string;

  @prop({required: true})
  public createdDate!: Date;

  public static async addDaily(): Promise<ExampleOffer> {
    const position = {name: "zpdicDaily", index: await this.fetchDailyNextIndex()};
    const translation = "彼女はこのアパートの 5 階に住んでいる。";
    const createdDate = new Date();
    const offer = new ExampleOfferModel({position, translation, createdDate});
    await offer.save();
    return offer;
  }

  public static async fetch(range?: QueryRange): Promise<WithSize<ExampleOffer>> {
    const query = ExampleOfferModel.find().sort("-createdDate");
    const result = await QueryRange.restrictWithSize(query, range);
    return result;
  }

  private static async fetchDailyNextIndex(): Promise<number> {
    const words = await ExampleOfferModel.find().where("position.name", "zpdicDaily").select("position.index").sort("-position.index").limit(1);
    if (words.length > 0) {
      return words[0].position.index + 1;
    } else {
      return 0;
    }
  }

}


export type ExampleOffer = DocumentType<ExampleOfferSchema>;
export const ExampleOfferModel = getModelForClass(ExampleOfferSchema);