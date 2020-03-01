//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  withRouter
} from "react-router-dom";
import {
  ComponentBase
} from "/client/component/component";
import {
  Header,
  LoginForm
} from "/client/component/compound";
import {
  applyStyle
} from "/client/util/decorator";


@applyStyle(require("./login-page.scss"))
class LoginPageBase extends ComponentBase<Props, State> {

  public render(): ReactNode {
    let node = (
      <div styleName="login-page">
        <Header/>
        <div styleName="description">ログイン</div>
        <div styleName="login-form">
          <LoginForm showsRegister={false}/>
        </div>
      </div>
    );
    return node;
  }

}


type Props = {
};
type State = {
};

export let LoginPage = withRouter(LoginPageBase);