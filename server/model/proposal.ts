//

import {
  DocumentType,
  Ref,
  getModelForClass,
  index,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import {PROPOSAL_LIMITS} from "/server/model/constant";
import {Dictionary, DictionarySchema} from "/server/model/dictionary/dictionary";
import {CustomError} from "/server/model/error";
import {QueryRange, WithSize} from "/server/util/query";


@modelOptions({schemaOptions: {collection: "commissions"}})
@index({"dictionary": 1, "createdDate": -1, "_id": -1})
export class ProposalSchema {

  @prop({required: true, ref: "DictionarySchema"})
  public dictionary!: Ref<DictionarySchema>;

  @prop({required: true, maxlength: PROPOSAL_LIMITS.termLength})
  public name!: string;

  @prop({maxlength: PROPOSAL_LIMITS.commentLength})
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
    await this.assertFields(proposal);
    await proposal.save();
    return proposal;
  }

  /** 提案データの各フィールドが上限を超えていないか検査します。*/
  private static async assertFields(proposal: Proposal): Promise<void> {
    try {
      await proposal.validate();
    } catch (error) {
      if (error instanceof Error && error.name === "ValidationError") {
        throw new CustomError("invalidProposal");
      } else {
        throw error;
      }
    }
  }

  public async discard(this: Proposal): Promise<void> {
    await this.deleteOne();
  }

}


export type Proposal = DocumentType<ProposalSchema>;
export const ProposalModel = getModelForClass(ProposalSchema);