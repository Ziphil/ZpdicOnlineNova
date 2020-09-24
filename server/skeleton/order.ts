//

import {
  Skeleton
} from "/server/skeleton/skeleton";


export class Order extends Skeleton {

  public id!: string;
  public name!: string;
  public comment?: string;
  public createdDate!: string;

}