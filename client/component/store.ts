//

import {
  boundAction,
  observable
} from "/client/util/decorator";


export class GlobalStore {

  @observable
  public popupSpec: {type: string, color: "error" | "information"} | null = null;

  @boundAction
  public sendError(type: string): void {
    this.popupSpec = {type, color: "error"};
  }

  @boundAction
  public sendInformation(type: string): void {
    this.popupSpec = {type, color: "information"};
  }

  @boundAction
  public clearPopup(): void {
    this.popupSpec = null;
  }

}