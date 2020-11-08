//

import axios from "axios";
import {
  action,
  observable
} from "mobx";
import {
  LANGUAGES
} from "/client/language";
import {
  DetailedUser
} from "/client/skeleton/user";
import {
  SERVER_PATHS,
  SERVER_PATH_PREFIX
} from "/server/controller/interface/type";


export class GlobalStore {

  @observable
  public locale: string = "";

  @observable
  public messages: Record<string, string> = {};

  @observable
  public user: DetailedUser | null = null;

  @observable
  public popupSpecs: Array<PopupSpec> = [];

  @action
  public async changeLocale(locale: string): Promise<void> {
    let language = LANGUAGES.find((language) => language.locale === locale) ?? LANGUAGES[0];
    this.locale = locale;
    this.messages = await language.fetchMessages().then((module) => module.default);
    localStorage.setItem("locale", locale);
  }

  @action
  public async defaultLocale(): Promise<void> {
    let locale = localStorage.getItem("locale") ?? "ja";
    this.changeLocale(locale);
  }

  @action
  public async fetchUser(): Promise<void> {
    let url = SERVER_PATH_PREFIX + SERVER_PATHS["fetchUser"];
    let response = await axios.post(url, {validateStatus: () => true});
    if (response.status === 200) {
      let user = response.data;
      this.user = user;
    } else {
      this.user = null;
    }
  }

  @action
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