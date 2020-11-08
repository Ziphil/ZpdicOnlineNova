//

import rison from "rison";
import {
  SearchMode,
  SearchType
} from "/client/skeleton/dictionary";
import {
  SEARCH_MODES,
  SearchParameter
} from "/client/skeleton/dictionary/search-parameter/search-parameter";
import {
  Skeleton
} from "/client/skeleton/skeleton";


export class AdvancedSearchParameter extends SearchParameter {

  public elements!: Array<AdvancedSearchParameterElement>;

  public static createEmpty(): AdvancedSearchParameter {
    let elements = [AdvancedSearchParameterElement.createEmpty()];
    let skeleton = AdvancedSearchParameter.of({elements});
    return skeleton;
  }

  public static deserializeEach(query: Record<string, unknown>): AdvancedSearchParameter {
    if (typeof query["advanced"] === "string") {
      let parameter = AdvancedSearchParameter.of(rison.decode(query["advanced"]));
      return parameter;
    } else {
      let parameter = AdvancedSearchParameter.of({elements: []});
      return parameter;
    }
  }

  public serialize(): string {
    let queryString = "advanced=" + encodeURI(rison.encode(this));
    return queryString;
  }

}


export class AdvancedSearchParameterElement extends Skeleton {

  public search!: string;
  public title!: string;
  public mode!: AdvancedSearchMode;
  public type!: SearchType;

  public static createEmpty(): AdvancedSearchParameterElement {
    let search = "";
    let title = "";
    let mode = "name" as const;
    let type = "exact" as const;
    let skeleton = AdvancedSearchParameterElement.of({search, title, mode, type});
    return skeleton;
  }

}


export const ADVANCED_SEARCH_MODES = SEARCH_MODES.filter((mode) => mode !== "both") as Array<AdvancedSearchMode>;
export type AdvancedSearchMode = Exclude<SearchMode, "both">;