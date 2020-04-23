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
          <div styleName="right"/>
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