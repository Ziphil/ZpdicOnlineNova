//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  StoreComponent
} from "/client/component/component";
import {
  applyStyle,
  inject,
  route
} from "/client/component/decorator";


@route @inject
@applyStyle(require("./footer.scss"))
export class Footer extends StoreComponent<Props, State> {

  public render(): ReactNode {
    let date = new Date();
    let yearString = date.getFullYear().toString();
    let node = (
      <footer styleName="root">
        <div styleName="container">
          <div styleName="left">
            <div styleName="copyright">
              © {yearString} Ziphil
            </div>
          </div>
          <div styleName="right">
            This site is protected by reCAPTCHA.<br/>
            The Google <a href="https://policies.google.com/privacy" target="_blank">Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank">Terms of Service</a> apply.
          </div>
        </div>
      </footer>
    );
    return node;
  }

}


type Props = {
};
type State = {
};