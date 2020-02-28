//

import * as react from "react";
import {
  Component,
  MouseEvent,
  ReactNode
} from "react";
import {
  applyStyle
} from "../../util/decorator";
import * as http from "../../util/http";
import {
  Button
} from "../atom/button";
import {
  Input
} from "../atom/input";


@applyStyle(require("./login-form.scss"))
export class LoginForm extends Component<{}, LoginFormState> {

  public state: LoginFormState = {
    name: "",
    password: ""
  };

  private async performLogin(event: MouseEvent<HTMLInputElement>): Promise<void> {
    let name = this.state.name;
    let password = this.state.password;
    await http.login("/api/user/login", name, password);
  }

  public render(): ReactNode {
    return (
      <form styleName="login">
        <Input label="ユーザー名" onChange={(value) => this.setState({name: value})}/>
        <Input label="パスワード" type="password" onChange={(value) => this.setState({password: value})}/>
        <div styleName="button-group">
          <Button value="ログイン" onClick={this.performLogin.bind(this)}/>
          <Button value="新規登録" color="green"/>
        </div>
      </form>
    );
  }

}


type LoginFormState = {
  name: string,
  password: string
};