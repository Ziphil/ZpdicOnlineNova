//

import * as react from "react";
import {
  Component,
  ReactNode
} from "react";
import * as css from "react-css-modules";
import {
  Input
} from "./input";


@css(require("./login-form.scss"))
export class LoginForm extends Component {

  public render(): ReactNode {
    return (
      <form styleName="login">
        <Input label="ユーザー名"/>
        <Input label="パスワード" inputType="password"/>
        <input type="submit" value="ログイン"/>
      </form>
    );
  }

}