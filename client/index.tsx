//

import {
  library as fontawesomeLibrary
} from "@fortawesome/fontawesome-svg-core";
import {
  faGithub as iconFaGithub
} from "@fortawesome/free-brands-svg-icons";
import {
  fas as iconFas
} from "@fortawesome/free-solid-svg-icons";
import nprogress from "nprogress";
import * as react from "react";
import {
  createRoot
} from "react-dom/client";
import Root from "/client/component/root";
import {
  RECAPTCHA_KEY
} from "/client/variable";


export class Main {

  public main(): void {
    this.appendIconElement();
    this.appendRecaptchaElement();
    this.setupTheme();
    this.setupNprogress();
    this.render();
  }

  private appendIconElement(): void {
    const element = document.createElement("link");
    element.href = "https://kit-free.fontawesome.com/releases/latest/css/free.min.css";
    element.rel = "stylesheet";
    element.media = "all";
    document.head.appendChild(element);
    fontawesomeLibrary.add(iconFas, iconFaGithub);
  }

  private appendRecaptchaElement(): void {
    const element = document.createElement("script");
    element.src = "https://www.google.com/recaptcha/api.js?render=" + RECAPTCHA_KEY;
    document.head.appendChild(element);
  }

  private setupTheme(): void {
    document.documentElement.setAttribute("data-theme", "light");
  }

  private setupNprogress(): void {
    nprogress.configure({trickleSpeed: 100, showSpinner: false});
  }

  private render(): void {
    const container = document.getElementById("root");
    if (container) {
      const root = createRoot(container);
      root.render(<Root/>);
    }
  }

}


const main = new Main();
main.main();