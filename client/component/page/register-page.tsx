//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  StoreComponent
} from "/client/component/component";
import {
  RegisterForm
} from "/client/component/compound";
import {
  applyStyle,
  intl,
  route
} from "/client/component/decorator";
import {
  Page
} from "/client/component/page/page";


@route @intl
@applyStyle(require("./register-page.scss"))
export default class RegisterPage extends StoreComponent<Props, State> {

  public render(): ReactNode {
    let node = (
      <Page>
        <div styleName="description">{this.trans("registerPage.desciption")}</div>
        <div styleName="form">
          <RegisterForm/>
        </div>
      </Page>
    );
    return node;
  }

}


type Props = {
};
type State = {
};