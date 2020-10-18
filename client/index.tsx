//

import * as react from "react";
import {
  render
} from "react-dom";
import {
  Root
} from "/client/component/root";


export class Main {

  public main(): void {
    this.appendIconElement();
    this.appendRecaptchaElement();
    this.render();
  }

  private appendIconElement(): void {
    let element = document.createElement("link");
    element.href = "https://kit-free.fontawesome.com/releases/latest/css/free.min.css";
    element.rel = "stylesheet";
    element.media = "all";
    document.head.appendChild(element);
  }

  private appendRecaptchaElement(): void {
    let element = document.createElement("script");
    element.src = "https://www.google.com/recaptcha/api.js?render=" + Main.getRecaptchaSite();
    document.head.appendChild(element);
  }

  private render(): void {
    render(<Root/>, document.getElementById("root"));
  }

  public static getRecaptchaSite(): string {
    return process.env["RECAPTCHA_KEY"] ?? "";
  }

}


let main = new Main();
main.main();