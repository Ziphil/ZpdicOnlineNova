//

import {
  DocumentType,
  Ref,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import {Dictionary, DictionarySchema} from "/server/model/dictionary/dictionary";
import {WithSize} from "/server/type/common";
import {QueryRange} from "/server/util/query";


@modelOptions({schemaOptions: {collection: "commissions"}})
export class CommissionSchema {

  @prop({required: true, ref: "DictionarySchema"})
  public dictionary!: Ref<DictionarySchema>;

  @prop({required: true})
  public name!: string;

  @prop({})
  public comment?: string;

  @prop({required: true})
  public createdDate!: Date;

  public static async fetchByDictionary(dictionary: Dictionary, range?: QueryRange): Promise<WithSize<Commission>> {
    const query = CommissionModel.find().where("dictionary", dictionary).sort("-createdDate");
    const result = await QueryRange.restrictWithSize(query, range);
    return result;
  }

  public static async fetchOneByDictionaryAndId(dictionary: Dictionary, id: string): Promise<Commission | null> {
    const commission = await CommissionModel.findById(id).where("dictionary", dictionary);
    return commission;
  }

  public static async add(dictionary: Dictionary, name: string, comment?: string): Promise<Commission> {
    const createdDate = new Date();
    const commission = new CommissionModel({dictionary, name, comment, createdDate});
    await commission.save();
    return commission;
  }

  public async discard(this: Commission): Promise<void> {
    await this.deleteOne();
  }

}


export type Commission = DocumentType<CommissionSchema>;
export const CommissionModel = getModelForClass(CommissionSchema);