//

import {
  DocumentType,
  Ref,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import {Dictionary, DictionarySchema} from "/server/model/dictionary/dictionary";
import {QueryRange, WithSize} from "/server/util/query";


@modelOptions({schemaOptions: {collection: "commissions"}})
export class ProposalSchema {

  @prop({required: true, ref: "DictionarySchema"})
  public dictionary!: Ref<DictionarySchema>;

  @prop({required: true})
  public name!: string;

  @prop({})
  public comment?: string;

  @prop({required: true})
  public createdDate!: Date;

  public static async fetchByDictionary(dictionary: Dictionary, range?: QueryRange): Promise<WithSize<Proposal>> {
    const query = ProposalModel.find().where("dictionary", dictionary).sort("-createdDate");
    const result = await QueryRange.restrictWithSize(query, range);
    return result;
  }

  public static async fetchOneByDictionaryAndId(dictionary: Dictionary, id: string): Promise<Proposal | null> {
    const proposal = await ProposalModel.findById(id).where("dictionary", dictionary);
    return proposal;
  }

  public static async add(dictionary: Dictionary, name: string, comment?: string): Promise<Proposal> {
    const createdDate = new Date();
    const proposal = new ProposalModel({dictionary, name, comment, createdDate});
    await proposal.save();
    return proposal;
  }

  public async discard(this: Proposal): Promise<void> {
    await this.deleteOne();
  }

}


export type Proposal = DocumentType<ProposalSchema>;
export const ProposalModel = getModelForClass(ProposalSchema);