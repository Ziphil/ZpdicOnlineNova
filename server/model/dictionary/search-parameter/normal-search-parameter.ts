//

import {
  Aggregate,
  Query
} from "mongoose";
import {
  Dictionary,
  SearchMode,
  SearchParameter,
  SearchType,
  Word,
  WordModel
} from "/server/model/dictionary";


export class NormalSearchParameter extends SearchParameter {

  public search: string;
  public mode: SearchMode;
  public type: SearchType;

  public constructor(search: string, mode: SearchMode, type: SearchType) {
    super();
    this.search = search;
    this.mode = mode;
    this.type = type;
  }

  public createQuery(dictionary: Dictionary): Query<Array<Word>> {
    let keys = SearchParameter.createKeys(this.mode);
    let needle = SearchParameter.createNeedle(this.search, this.type);
    let disjunctFilters = keys.map((key) => WordModel.find().where(key, needle).getFilter());
    let query = WordModel.find().where("dictionary", dictionary).or(disjunctFilters);
    return query;
  }

  public createSuggestionAggregate(dictionary: Dictionary): Aggregate<Array<{title: string, word: Word}>> | null {
    let mode = this.mode;
    let type = this.type;
    if ((mode === "name" || mode === "both") && (type === "exact" || type === "prefix")) {
      let needle = SearchParameter.createNeedle(this.search, "exact");
      let aggregate = WordModel.aggregate();
      aggregate = aggregate.match(WordModel.where("dictionary", dictionary["_id"]).where("variations.name", needle).getFilter());
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