//

import {
  boundAction,
  observable
} from "/client/component/decorator";
import {
  UserSkeleton
} from "/server/skeleton/user";


export class GlobalStore {

  @observable
  public user: UserSkeleton | null = null;

  @observable
  public popupSpecs: Array<{id: any, type: string, style: PopupStyle}> = [];

  private send(type: string, style: PopupStyle): void {
    let date = new Date();
    let id = date.getTime();
    this.popupSpecs = [...this.popupSpecs, {id, type, style}];
  }

  @boundAction
  public sendError(type: string): void {
    this.send(type, "error");
  }

  @boundAction
  public sendInformation(type: string): void {
    this.send(type, "information");
  }

  @boundAction
  public clearPopups(): void {
    this.popupSpecs = [];
  }

}


type PopupStyle = "error" | "information";