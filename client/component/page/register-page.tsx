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
  RegisterForm
} from "/client/component/compound";
import {
  applyStyle
} from "/client/util/decorator";


@applyStyle(require("./login-page.scss"))
class RegisterPageBase extends ComponentBase<Props, State> {

  public render(): ReactNode {
    let node = (
      <div styleName="page">
        <Header/>
        <div styleName="description">新規登録</div>
        <div styleName="login-form">
          <RegisterForm/>
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

export let RegisterPage = withRouter(RegisterPageBase);