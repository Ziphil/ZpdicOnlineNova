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
  public title!: string | null;
  public mode!: SearchMode;
  public type!: SearchType;

}