//

import {
  Aggregate,
  Query
} from "mongoose";
import {
  AdvancedSearchParameter,
  AdvancedSearchParameterElement,
  Dictionary,
  NormalSearchParameter,
  Word
} from "/server/model/dictionary";
import {
  AdvancedSearchParameter as AdvancedSearchParameterSkeleton,
  NormalSearchParameter as NormalSearchParameterSkeleton,
  SearchParameter as SearchParameterSkeleton
} from "/server/skeleton/dictionary";
export {
  AdvancedSearchMode,
  SearchMode,
  SearchModeUtil,
  SearchType,
  SearchTypeUtil
} from "/server/skeleton/dictionary";


export abstract class SearchParameter {

  public abstract createQuery(dictionary: Dictionary): Query<Array<Word>>;

  // この検索パラメータからサジェストされる単語を検索するためのクエリを返します。
  // 何もサジェストする必要がない場合は null を返します。
  public abstract createSuggestionAggregate(dictionary: Dictionary): Aggregate<Array<{title: string, word: Word}>> | null;

}


export class SearchParameterCreator {

  public static restore(skeleton: SearchParameterSkeleton): SearchParameter {
    if ("elements" in skeleton) {
      let castSkeleton = skeleton as AdvancedSearchParameterSkeleton;
      let elements = castSkeleton.elements.map((element) => new AdvancedSearchParameterElement(element.search, element.title, element.mode, element.type));
      let raw = new AdvancedSearchParameter(elements);
      return raw;
    } else {
      let castSkeleton = skeleton as NormalSearchParameterSkeleton;
      let raw = new NormalSearchParameter(castSkeleton.search, castSkeleton.mode, castSkeleton.type);
      return raw;
    }
  }

}