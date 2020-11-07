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
    let query = WordModel.find();
    return query;
  }

  public createSuggestionAggregate(dictionary: Dictionary): Aggregate<Array<{title: string, word: Word}>> | null {
    return null;
  }

}


export class AdvancedSearchParameterElement {

  public search!: string;
  public title!: string;
  public mode!: AdvancedSearchMode;
  public type!: SearchType;

  public constructor(search: string, title: string, mode: AdvancedSearchMode, type: SearchType) {
    this.search = search;
    this.title = title;
    this.mode = mode;
    this.type = type;
  }

}