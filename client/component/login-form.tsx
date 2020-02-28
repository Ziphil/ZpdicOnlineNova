//

import * as react from "react";
import {
  Component,
  MouseEvent,
  ReactNode
} from "react";
import {
  Button
} from "./atom/button";
import {
  Input
} from "./atom/input";
import {
  applyStyle
} from "./util/decorator";
import {
  post
} from "./util/http";


@applyStyle(require("./login-form.scss"))
export class LoginForm extends Component<{}, LoginFormState> {

  public state: LoginFormState = {
    name: "",
    password: ""
  };

  private async performLogin(event: MouseEvent<HTMLInputElement>): Promise<void> {
    let {name, password} = this.state;
    let result = await post<LoginResult>("/api/user/login", {name, password});
    if (result.data) {
      localStorage.setItem("token", result.data.token);
      localStorage.setItem("name", result.data.name);
      console.log(result.data);
    }
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


interface LoginFormState {

  name: string;
  password: string;

}


interface LoginResult {

  token: string;
  name: string;

}