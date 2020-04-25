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
  public popupSpecs: Array<{id: number, type: string, style: PopupStyle}> = [];

  private addPopup(type: string, style: PopupStyle): void {
    let date = new Date();
    let id = date.getTime();
    this.popupSpecs.push({id, type, style});
  }

  @boundAction
  public addErrorPopup(type: string): void {
    this.addPopup(type, "error");
  }

  @boundAction
  public addInformationPopup(type: string): void {
    this.addPopup(type, "information");
  }

  @boundAction
  public clearPopup(id: number): void {
    this.popupSpecs = this.popupSpecs.filter((spec) => spec.id !== id);
  }

  @boundAction
  public clearAllPopups(): void {
    this.popupSpecs = [];
  }

}


type PopupStyle = "error" | "information";