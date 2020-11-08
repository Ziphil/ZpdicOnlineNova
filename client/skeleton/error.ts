//

import {
  Skeleton
} from "/client/skeleton/skeleton";


export class CustomError<E extends string = string> extends Skeleton {

  public error!: "Error";
  public type!: E;
  public code?: number;

  public static ofType<E extends string>(type: E, code?: number): CustomError<E> {
    let object = {error: "Error", type, code} as any;
    let skeleton = this.of(object) as any;
    return skeleton;
  }

}