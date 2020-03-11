//

import {
  action,
  computed,
  observable
} from "mobx";
import {
  CustomErrorSkeleton
} from "/server/model/error";


export class GlobalStore {

  @observable
  public error: CustomErrorSkeleton<string> | null = null;

  @bound
  public setError<E extends string>(error: CustomErrorSkeleton<E>): void {
    this.error = error;
  }

}


let bound = action.bound;