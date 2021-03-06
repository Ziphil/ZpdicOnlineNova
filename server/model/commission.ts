//

import {
  DocumentType,
  Ref,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import {
  Commission as CommissionSkeleton
} from "/client/skeleton/commission";
import {
  WithSize
} from "/server/controller/internal/type";
import {
  Dictionary,
  DictionarySchema
} from "/server/model/dictionary";
import {
  CustomError
} from "/server/model/error";
import {
  QueryRange
} from "/server/util/query";


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
    let query = CommissionModel.find().where("dictionary", dictionary).sort("-createdDate");
    let result = await QueryRange.restrictWithSize(query, range);
    return result;
  }

  public static async fetchOneByDictionaryAndId(dictionary: Dictionary, id: string): Promise<Commission | null> {
    let commission = await CommissionModel.findById(id).where("dictionary", dictionary);
    return commission;
  }

  public static async add(dictionary: Dictionary, name: string, comment?: string): Promise<Commission> {
    let createdDate = new Date();
    let commission = new CommissionModel({dictionary, name, comment, createdDate});
    await commission.save();
    return commission;
  }

  public async discard(this: Commission): Promise<void> {
    await this.deleteOne();
  }

}


export class CommissionCreator {

  public static create(raw: Commission): CommissionSkeleton {
    let id = raw.id;
    let name = raw.name;
    let comment = raw.comment;
    let createdDate = raw.createdDate.toISOString();
    let skeleton = {id, name, comment, createdDate};
    return skeleton;

  }

}


export type Commission = DocumentType<CommissionSchema>;
export let CommissionModel = getModelForClass(CommissionSchema);