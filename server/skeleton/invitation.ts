//

import {
  DetailedDictionary
} from "/server/skeleton/dictionary";
import {
  Skeleton
} from "/server/skeleton/skeleton";


export class Invitation extends Skeleton {

  public id!: string;
  public type!: string;
  public dictionary!: DetailedDictionary;
  public createdDate!: string;

}