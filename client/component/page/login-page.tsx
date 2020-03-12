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
  LoginForm
} from "/client/component/compound";
import {
  applyStyle,
  route
} from "/client/util/decorator";


@route
@applyStyle(require("./login-page.scss"))
export class LoginPage extends StoreComponent<Props, State> {

  public render(): ReactNode {
    let node = (
      <div styleName="page">
        <Header/>
        <div styleName="content">
          <div styleName="description">ログイン</div>
          <div styleName="login-form">
            <LoginForm showsRegister={false}/>
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