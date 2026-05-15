//

import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import {CustomError} from "/server/model/error";
import {ExampleOfferParameter} from "/server/model/example-offer-parameter/example-offer-parameter";
import {SystemModel} from "/server/model/system";
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
    const number = await this.fetchDailyNextNumber();
    const system = await SystemModel.findOne();
    if (system !== null) {
      const [wordCount, cefrLevel] = [[10, "A1"], [13, "A2"], [15, "B1"]][number % 3] as [number, string];
      const userPrompt = system.dailyExampleOfferUserPrompt.replace("{{wordCount}}", wordCount.toString()).replace("{{cefrLevel}}", cefrLevel);
      const systemPrompt = system.dailyExampleOfferSystemPrompt;
      const answer = await askClaude(userPrompt, systemPrompt);
      const translation = answer.match(/<sentence>(.*?)<\/sentence>/s)?.[1]?.trim();
      if (translation) {
        const offer = new ExampleOfferModel({
          catalog: "zpdicDaily",
          number,
          translation,
          author: "ZpDIC Online",
          createdDate: new Date()
        });
        await offer.save();
        return ["", offer];
      } else {
        throw new CustomError("invalidClaudeResponse");
      }
    } else {
      throw new CustomError("systemNotFound");
    }
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