//

import axios from "axios";
import {
  action,
  observable
} from "mobx";
import {
  SERVER_PATH
} from "/server/controller/type";
import {
  DetailedUser
} from "/server/skeleton/user";


export class GlobalStore {

  @observable
  public locale: string = GlobalStore.getDefaultLocale();

  @observable
  public user: DetailedUser | null = null;

  @observable
  public popupSpecs: Array<PopupSpec> = [];

  @action
  public changeLocale(locale: string): void {
    this.locale = locale;
    localStorage.setItem("locale", locale);
  }

  private static getDefaultLocale(): string {
    return localStorage.getItem("locale") ?? "ja";
  }

  @action
  public async fetchUser(): Promise<void> {
    let url = SERVER_PATH["fetchUser"];
    let response = await axios.get(url, {validateStatus: () => true});
    if (response.status === 200) {
      let user = response.data;
      this.user = user;
    } else {
      this.user = null;
    }
  }

  private addPopup(type: string, style: PopupStyle, timeout: number | null): void {
    let date = new Date();
    let id = date.getTime();
    this.popupSpecs.push({id, type, style});
    if (timeout !== null) {
      setTimeout(() => this.clearPopup(id), timeout);
    }
  }

  @action
  public addErrorPopup(type: string, timeout: number | null = 5000): void {
    this.addPopup(type, "error", timeout);
  }

  @action
  public addInformationPopup(type: string, timeout: number | null = 5000): void {
    this.addPopup(type, "information", timeout);
  }

  @action
  public clearPopup(id: number): void {
    this.popupSpecs = this.popupSpecs.filter((spec) => spec.id !== id);
  }

  @action
  public clearAllPopups(): void {
    this.popupSpecs = [];
  }

}


type PopupStyle = "error" | "information";
type PopupSpec = {id: number, type: string, style: PopupStyle};