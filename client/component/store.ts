//

import {
  action,
  observable
} from "mobx";


export class GlobalStore {

  @observable
  public popupSpec: {type: string, color: "error" | "information"} | null = null;

  @bound
  public sendError(type: string): void {
    this.popupSpec = {type, color: "error"};
  }

  @bound
  public sendInformation(type: string): void {
    this.popupSpec = {type, color: "information"};
  }

  @bound
  public clearPopup(): void {
    this.popupSpec = null;
  }

}


let bound = action.bound;