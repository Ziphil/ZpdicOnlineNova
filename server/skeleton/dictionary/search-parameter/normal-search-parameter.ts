//

import {
  SearchMode,
  SearchType
} from "/server/skeleton/dictionary";
import {
  Skeleton
} from "/server/skeleton/skeleton";


export class NormalSearchParameter extends Skeleton {

  public search!: string;
  public mode!: SearchMode;
  public type!: SearchType;

}