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
  route
} from "/client/component/decorator";
import {
  Page
} from "/client/component/page/page";


@route
@applyStyle(require("./login-page.scss"))
export class LoginPage extends StoreComponent<Props, State> {

  public render(): ReactNode {
    let node = (
      <Page>
        <div styleName="description">ログイン</div>
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