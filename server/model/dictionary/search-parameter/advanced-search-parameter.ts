//

import {
  Aggregate,
  Query
} from "mongoose";
import {
  AdvancedSearchMode,
  Dictionary,
  SearchType,
  Word,
  WordModel
} from "/server/model/dictionary";
import {
  SearchParameter
} from "/server/model/dictionary/search-parameter/search-parameter";


export class AdvancedSearchParameter extends SearchParameter {

  public elements: Array<AdvancedSearchParameterElement>;

  public constructor(elements: Array<AdvancedSearchParameterElement>) {
    super();
    this.elements = elements;
  }

  public createQuery(dictionary: Dictionary): Query<Array<Word>> {
    let filters = this.elements.map((element) => element.createQuery(dictionary).getFilter());
    let query = WordModel.find().and(filters);
    return query;
  }

  public createSuggestionAggregate(dictionary: Dictionary): Aggregate<Array<{title: string, word: Word}>> | null {
    return null;
  }

}


export class AdvancedSearchParameterElement extends SearchParameter {

  public search!: string;
  public title!: string;
  public mode!: AdvancedSearchMode;
  public type!: SearchType;

  public constructor(search: string, title: string, mode: AdvancedSearchMode, type: SearchType) {
    super();
    this.search = search;
    this.title = title;
    this.mode = mode;
    this.type = type;
  }

  public createQuery(dictionary: Dictionary): Query<Array<Word>> {
    let keys = SearchParameter.createKeys(this.mode);
    let needle = SearchParameter.createNeedle(this.search, this.type);
    let eachFilters = keys.map((key) => {
      let eachQuery = WordModel.find().where(key, needle);
      if (this.title && (this.mode === "equivalent" || this.mode === "information")) {
        eachQuery = eachQuery.where(`${this.mode}s.title`, this.title);
      }
      let eachFilter = eachQuery.getFilter();
      return eachFilter;
    });
    let query = WordModel.find().where("dictionary", dictionary).or(eachFilters);
    return query;
  }

  public createSuggestionAggregate(dictionary: Dictionary): Aggregate<Array<{title: string, word: Word}>> | null {
    return null;
  }

}