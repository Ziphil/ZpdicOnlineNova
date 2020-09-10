//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  StoreComponent
} from "/client/component/component";
import {
  LoginForm
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
@applyStyle(require("./login-page.scss"))
export class LoginPage extends StoreComponent<Props, State> {

  public render(): ReactNode {
    let node = (
      <Page>
        <div styleName="description">{this.trans("loginPage.description")}</div>
        <div styleName="form">
          <LoginForm showsRegister={false}/>
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