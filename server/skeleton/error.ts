//

import {
  Skeleton
} from "/server/skeleton/skeleton";


export class CustomErrorSkeleton<E extends string = string> extends Skeleton {

  public error!: "Error";
  public type!: E;
  public code?: number;

  public static ofType<E extends string>(type: E, code?: number): CustomErrorSkeleton<E> {
    let object = {error: "Error", type, code} as any;
    let skeleton = this.of<CustomErrorSkeleton<E>>(object);
    return skeleton;
  }

}