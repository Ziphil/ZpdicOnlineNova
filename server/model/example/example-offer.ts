//

import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import {ExampleOfferPositionSchema} from "/server/model/example/example-offer-position";
import {WithSize} from "/server/type/common";
import {askClaude} from "/server/util/claude";
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
    const createdDate = new Date();
    const answer = await askClaude(`
      まず、日本語の単語をランダムに1つ決めてください。
      これが、これから生成する例文のテーマになります。
      
      その後、今決めた単語を用いて例文を日本語で1つ生成してください。
      このとき、以下の条件を満たすようにしてください。
      <conditions>
      - 1つの文である
      - 文の含まれる単語数は10以上15以下である
      - 含まれる単語はできるだけ日常生活で使われる頻度が高いものにする
      </conditions>
      
      回答は、最初に決めた単語を<word></word>タグに入れ、最後に生成した文を<sentence></sentence>タグに入れてください。
    `, `
      あなたは、外国語の学習者のために例文を生成するAIです。
      利用者はあなたが生成した例文を外国語に翻訳することで外国語の勉強をするので、外国語への翻訳がしやすい文を生成してください。
    `);
    const translation = answer.match(/<sentence>(.*?)<\/sentence>/)?.[1] ?? "";
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