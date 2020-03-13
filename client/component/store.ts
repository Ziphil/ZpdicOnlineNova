//

import {
  boundAction,
  observable
} from "/client/util/decorator";
import {
  UserSkeleton
} from "/server/model/user";


export class GlobalStore {

  @observable
  public user: UserSkeleton | null = null;

  @observable
  public popupSpec: {type: string, style: "error" | "information"} | null = null;

  @boundAction
  public sendError(type: string): void {
    this.popupSpec = {type, style: "error"};
  }

  @boundAction
  public sendInformation(type: string): void {
    this.popupSpec = {type, style: "information"};
  }

  @boundAction
  public clearPopup(): void {
    this.popupSpec = null;
  }

}