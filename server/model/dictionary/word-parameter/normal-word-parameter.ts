//

import {
  Aggregate,
  Query
} from "mongoose";
import {
  Dictionary,
  RawSuggestion,
  Word,
  WordMode,
  WordModel,
  WordOrder,
  WordType
} from "/server/model/dictionary";
import {
  WordIgnoreOptions,
  WordParameter
} from "/server/model/dictionary/word-parameter/word-parameter";


export class NormalWordParameter extends WordParameter {

  public text: string;
  public mode: WordMode;
  public type: WordType;
  public order: WordOrder;
  public ignoreOptions: WordIgnoreOptions;
  public enableSuggestions: boolean;

  public constructor(text: string, mode: WordMode, type: WordType, order: WordOrder, ignoreOptions: WordIgnoreOptions, enableSuggestions: boolean) {
    super();
    this.text = text;
    this.mode = mode;
    this.type = type;
    this.order = order;
    this.ignoreOptions = ignoreOptions;
    this.enableSuggestions = enableSuggestions;
  }

  public createQuery(dictionary: Dictionary): Query<Array<Word>, Word> {
    const keys = WordParameter.createKeys(this.mode);
    const needle = WordParameter.createNeedle(this.text, this.type, this.ignoreOptions);
    const sortKey = WordParameter.createSortKey(this.order);
    const disjunctFilters = keys.map((key) => WordModel.find().where(key, needle).getFilter());
    const query = WordModel.findExist().where("dictionary", dictionary).or(disjunctFilters).sort(sortKey);
    return query;
  }

  public createSuggestionQuery(dictionary: Dictionary): Aggregate<Array<RawSuggestion>> | null {
    if (this.enableSuggestions) {
      const mode = this.mode;
      const type = this.type;
      if ((mode === "name" || mode === "both") && (type === "exact" || type === "prefix")) {
        const needle = WordParameter.createNeedle(this.text, "exact", {case: false});
        let aggregate = WordModel.aggregate();
        aggregate = aggregate.match(WordModel.findExist().where("dictionary", dictionary["_id"]).where("variations.name", needle).getFilter());
        aggregate = aggregate.addFields({oldVariations: "$variations"});
        aggregate = aggregate.unwind("$oldVariations");
        aggregate = aggregate.match(WordModel.where("oldVariations.name", needle).getFilter());
        aggregate = aggregate.project({title: "$oldVariations.title", word: "$$CURRENT"});
        return aggregate;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

}