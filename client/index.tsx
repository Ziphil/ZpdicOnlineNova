//

import * as react from "react";
import {
  render
} from "react-dom";
import {
  Root
} from "/client/component/root";


export const TITLES = ["ZpDIC", "Online"];
export const VERSION = "2.11.0";


class Main {

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
    element.src = "https://www.google.com/recaptcha/api.js?render=6LeWRMkZAAAAADzUAl1LAFr9fT7kdW7yoVn6Qhms";
    document.head.appendChild(element);
  }

  private render(): void {
    render(<Root/>, document.getElementById("root"));
  }

}


let main = new Main();
main.main();