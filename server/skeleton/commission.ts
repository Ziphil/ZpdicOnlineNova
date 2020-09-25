//

import {
  Skeleton
} from "/server/skeleton/skeleton";


export class Commission extends Skeleton {

  public id!: string;
  public name!: string;
  public comment?: string;
  public createdDate!: string;

}