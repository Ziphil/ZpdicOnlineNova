//

import {
  Aggregate,
  Query
} from "mongoose";
import {
  AdvancedWordParameter as AdvancedSearchParameterSkeleton,
  NormalWordParameter as NormalSearchParameterSkeleton,
  WordParameter as SearchParameterSkeleton
} from "/client/skeleton/dictionary";
export {
  AdvancedSearchMode,
  SearchMode,
  SearchModeUtil,
  SearchType,
  SearchTypeUtil
} from "/client/skeleton/dictionary";
import {
  AdvancedWordParameter,
  AdvancedWordParameterElement,
  Dictionary,
  NormalWordParameter,
  SearchMode,
  SearchType,
  Word
} from "/server/model/dictionary";
import {
  escapeRegexp
} from "/server/util/misc";


export abstract class WordParameter {

  public abstract createQuery(dictionary: Dictionary): Query<Array<Word>>;

  // この検索パラメータからサジェストされる単語を検索するためのクエリを返します。
  // 何もサジェストする必要がない場合は null を返します。
  public abstract createSuggestionAggregate(dictionary: Dictionary): Aggregate<Array<{title: string, word: Word}>> | null;

  protected static createKeys(mode: SearchMode): Array<string> {
    if (mode === "name") {
      return ["name"];
    } else if (mode === "equivalent") {
      return ["equivalents.names"];
    } else if (mode === "both") {
      return ["name", "equivalents.names"];
    } else if (mode === "tag") {
      return ["tags"];
    } else if (mode === "information") {
      return ["informations.text"];
    } else {
      return ["name", "equivalents.names", "informations.text"];
    }
  }

  protected static createNeedle(search: string, type: SearchType): string | RegExp {
    let escapedSearch = escapeRegexp(search);
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


export class SearchParameterCreator {

  public static restore(skeleton: SearchParameterSkeleton): WordParameter {
    if ("elements" in skeleton) {
      let castSkeleton = skeleton as AdvancedSearchParameterSkeleton;
      let elements = castSkeleton.elements.map((element) => new AdvancedWordParameterElement(element.search, element.title, element.mode, element.type));
      let raw = new AdvancedWordParameter(elements);
      return raw;
    } else {
      let castSkeleton = skeleton as NormalSearchParameterSkeleton;
      let raw = new NormalWordParameter(castSkeleton.search, castSkeleton.mode, castSkeleton.type);
      return raw;
    }
  }

}