//

import * as react from "react";
import {
  Component,
  ReactNode
} from "react";
import * as css from "react-css-modules";
import {
  Button
} from "./atom/button";
import {
  Input
} from "./atom/input";
import {
  applyStyle
} from "./util/decorator";


@applyStyle(require("./login-form.scss"))
export class LoginForm extends Component {

  public render(): ReactNode {
    return (
      <form styleName="login">
        <Input label="ユーザー名"/>
        <Input label="パスワード" inputType="password"/>
        <div styleName="button-group">
          <Button value="ログイン"/>
          <Button value="新規登録" color="green"/>
        </div>
      </form>
    );
  }

}