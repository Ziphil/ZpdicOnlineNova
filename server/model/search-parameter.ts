//

import {
  Query
} from "mongoose";
import {
  Word,
  WordModel
} from "/server/model/dictionary";
import {
  SearchMode,
  SearchType
} from "/server/skeleton/search-parameter";
export {
  SearchMode,
  SearchModeUtil,
  SearchType,
  SearchTypeUtil
} from "/server/skeleton/search-parameter";


export class NormalSearchParameter {

  public search: string;
  public mode: SearchMode;
  public type: SearchType;

  public constructor(search: string, mode: SearchMode, type: SearchType) {
    this.search = search;
    this.mode = mode;
    this.type = type;
  }

  public createQuery(): Query<Array<Word>> {
    let keys = this.createKeys();
    let needle = this.createNeedle();
    let eachQueries = keys.map((key) => WordModel.find().where(key, needle).getFilter());
    let query = WordModel.find().or(eachQueries);
    return query;
  }

  // この検索パラメータからサジェストされる単語を検索するためのクエリを返します。
  // 何もサジェストする必要がない場合は null を返します。
  public createSuggestionQuery(): Query<Array<Word>> | null {
    let mode = this.mode;
    let type = this.type;
    if ((mode === "name" || mode === "both") && (type === "exact" || type === "prefix")) {
      let needle = this.createNeedle("exact");
      let query = WordModel.find().where("variations.name", needle);
      return query;
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