//

import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import fs from "fs/promises";
import {ExampleOfferParameter} from "/server/model/example-offer-parameter/example-offer-parameter";
import {askClaude} from "/server/util/claude";
import {QueryRange, WithSize} from "/server/util/query";


@modelOptions({schemaOptions: {collection: "exampleOffers"}})
export class ExampleOfferSchema {

  @prop({required: true})
  public catalog!: string;

  @prop({required: true})
  public number!: number;

  @prop({required: true})
  public translation!: string;

  @prop()
  public supplement?: string;

  @prop({required: true})
  public author!: string;

  @prop({required: true})
  public createdDate!: Date;

  public static async addDaily(): Promise<[string, ExampleOffer]> {
    const catalog = "zpdicDaily";
    const number = await this.fetchDailyNextNumber();
    const author = "ZpDIC Online";
    const createdDate = new Date();
    const keywords = await fs.readFile("./dist/static/keyword.txt", "utf-8").then((content) => content.split(/\s*\n\s*/));
    const keyword = keywords[Math.floor(Math.random() * keywords.length)];
    const answer = await askClaude(`
      「${keyword}」という単語をテーマにして、例文を日本語で1つ生成してください。
      このとき、以下の条件を満たすようにしてください。
      <conditions>
      - 1つの文である
      - 文に含まれる単語数は${(number % 2 === 0) ? "5以上10以下" : "10以上15以下"}である
      - 文に「${keyword}」という単語が含まれる (変化形も可)
      - 文に含まれる単語は${(number % 2 === 0) ? "誰でも知っている非常に簡単なものだけにする" : "できるだけ日常生活で使われる頻度が高いものにする"}
      </conditions>
      回答では、最後に生成した文を<sentence></sentence>タグに入れてください。
    `, `
      あなたは、外国語の学習者のために例文を生成するAIです。
      利用者はあなたが生成した例文を外国語に翻訳することで外国語の勉強をするので、外国語への翻訳がしやすい文を生成してください。
    `);
    const translation = answer.match(/<sentence>(.*?)<\/sentence>/)?.[1] ?? "";
    const offer = new ExampleOfferModel({catalog, number, translation, author, createdDate});
    await offer.save();
    return [keyword, offer];
  }

  public static async fetchOneByNumber(catalog: string, number: number): Promise<ExampleOffer | null> {
    const offer = await ExampleOfferModel.findOne().where("catalog", catalog).where("number", number);
    return offer;
  }

  public static async search(parameter: ExampleOfferParameter, range?: QueryRange): Promise<WithSize<ExampleOffer>> {
    const query = parameter.createQuery();
    const offers = await QueryRange.restrictWithSize(query, range);
    return offers;
  }

  public static async fetchCatalogs(): Promise<Array<string>> {
    const names = await ExampleOfferModel.distinct("catalog");
    return names;
  }

  private static async fetchDailyNextNumber(): Promise<number> {
    const words = await ExampleOfferModel.find().where("catalog", "zpdicDaily").select("number").sort("-number").limit(1);
    if (words.length > 0) {
      return words[0].number + 1;
    } else {
      return 1;
    }
  }

}


export type ExampleOffer = DocumentType<ExampleOfferSchema>;
export const ExampleOfferModel = getModelForClass(ExampleOfferSchema);