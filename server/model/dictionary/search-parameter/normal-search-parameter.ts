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
    let keys = this.createKeys();
    let needle = this.createNeedle();
    let disjunctQueries = keys.map((key) => WordModel.find().where(key, needle).getFilter());
    let query = WordModel.find().where("dictionary", dictionary).or(disjunctQueries);
    return query;
  }

  public createSuggestionAggregate(dictionary: Dictionary): Aggregate<Array<{title: string, word: Word}>> | null {
    let mode = this.mode;
    let type = this.type;
    if ((mode === "name" || mode === "both") && (type === "exact" || type === "prefix")) {
      let needle = this.createNeedle("exact");
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

  private createKeys(): Array<string> {
    let mode = this.mode;
    if (mode === "name") {
      return ["name"];
    } else if (mode === "equivalent") {
      return ["equivalents.names"];
    } else if (mode === "both") {
      return ["name", "equivalents.names"];
    } else {
      return ["name", "equivalents.names", "informations.text"];
    }
  }

  private createNeedle(overriddenType?: SearchType): string | RegExp {
    let search = this.search;
    let escapedSearch = search.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
    let type = overriddenType ?? this.type;
    if (type === "exact") {
      return search;
    } else if (type === "prefix") {
      return new RegExp("^" + escapedSearch);
    } else if (type === "suffix") {
      return new RegExp(escapedSearch + "$");
    } else if (type === "part") {
      return new RegExp(escapedSearch);
    } else {
      try {
        return new RegExp(search);
      } catch (error) {
        return "";
      }
    }
  }

}