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

  public search: string;
  public mode: WordMode;
  public type: WordType;
  public order: WordOrder;
  public ignoreOptions: WordIgnoreOptions;

  public constructor(search: string, mode: WordMode, type: WordType, order: WordOrder, ignoreOptions: WordIgnoreOptions) {
    super();
    this.search = search;
    this.mode = mode;
    this.type = type;
    this.order = order;
    this.ignoreOptions = ignoreOptions;
  }

  public createQuery(dictionary: Dictionary): Query<Array<Word>> {
    let keys = WordParameter.createKeys(this.mode);
    let needle = WordParameter.createNeedle(this.search, this.type, this.ignoreOptions);
    let sortKey = WordParameter.createSortKey(this.order);
    let disjunctFilters = keys.map((key) => WordModel.find().where(key, needle).getFilter());
    let query = WordModel.findExist().where("dictionary", dictionary).or(disjunctFilters).sort(sortKey);
    return query;
  }

  public createSuggestionQuery(dictionary: Dictionary): Aggregate<Array<RawSuggestion>> | null {
    let mode = this.mode;
    let type = this.type;
    if ((mode === "name" || mode === "both") && (type === "exact" || type === "prefix")) {
      let needle = WordParameter.createNeedle(this.search, "exact", {case: false});
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
  }

}