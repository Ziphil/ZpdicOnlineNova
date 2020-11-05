//

import {
  SearchMode,
  SearchType
} from "/server/skeleton/dictionary";
import {
  Skeleton
} from "/server/skeleton/skeleton";


export class AdvancedSearchParameter extends Skeleton {

  public elements!: Array<AdvancedSearchParameterElement>;

}


export class AdvancedSearchParameterElement extends Skeleton {

  public search!: string;
  public title!: string;
  public mode!: SearchMode;
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