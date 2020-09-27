//

import {
  Aggregate,
  Query
} from "mongoose";
import {
  Dictionary,
  Word
} from "/server/model/dictionary";
export {
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