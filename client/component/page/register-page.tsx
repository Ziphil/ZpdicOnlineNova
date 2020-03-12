//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  StoreComponent
} from "/client/component/component";
import {
  Header,
  RegisterForm
} from "/client/component/compound";
import {
  applyStyle,
  route
} from "/client/util/decorator";


@route
@applyStyle(require("./register-page.scss"))
export class RegisterPage extends StoreComponent<Props, State> {

  public render(): ReactNode {
    let node = (
      <div styleName="page">
        <Header/>
        <div styleName="content">
          <div styleName="description">新規登録</div>
          <div styleName="login-form">
            <RegisterForm/>
          </div>
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