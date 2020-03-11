//

import {
  action,
  observable
} from "mobx";
import {
  CustomErrorSkeleton
} from "/server/model/error";


export class GlobalStore {

  @observable
  public floatingSpec: {type: string, color: "error" | "information"} | null = null;

  @bound
  public sendError<E extends string>(error: CustomErrorSkeleton<E>): void {
    let type = error.type;
    this.floatingSpec = {type, color: "error"};
  }

  @bound
  public sendInformation(type: string): void {
    this.floatingSpec = {type, color: "information"};
  }

}


let bound = action.bound;