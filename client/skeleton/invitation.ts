//

import {
  DetailedDictionary
} from "/client/skeleton/dictionary";
import {
  Skeleton
} from "/client/skeleton/skeleton";


export class Invitation extends Skeleton {

  public id!: string;
  public type!: string;
  public dictionary!: DetailedDictionary;
  public createdDate!: string;

}