//

import {createRoot} from "react-dom/client";
import {Root} from "/client/component/root";
import {RECAPTCHA_KEY} from "/client/variable";
import "/client/util/socket";


export class Main {

  public main(): void {
    this.appendRecaptchaElement();
    this.appendGoogleAdElement();
    this.render();
  }

  private appendRecaptchaElement(): void {
    const element = document.createElement("script");
    element.src = "https://www.google.com/recaptcha/api.js?render=" + RECAPTCHA_KEY;
    document.head.appendChild(element);
  }

  private appendGoogleAdElement(): void {
    const element = document.createElement("script");
    element.id = "google-ads-sdk";
    element.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
    element.crossOrigin = "anonymous";
    element.async = true;
    document.head.appendChild(element);
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