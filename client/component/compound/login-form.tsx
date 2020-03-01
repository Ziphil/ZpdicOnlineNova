//

import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import {
  withRouter
} from "react-router-dom";
import {
  applyStyle
} from "../../util/decorator";
import * as http from "../../util/http";
import {
  Button,
  Input
} from "../atom";
import {
  ComponentBase
} from "../component";


@applyStyle(require("./login-form.scss"))
class LoginFormBase extends ComponentBase<Props, State> {

  public state: State = {
    name: "",
    password: ""
  };

  private async performLogin(event: MouseEvent<HTMLInputElement>): Promise<void> {
    let name = this.state.name;
    let password = this.state.password;
    let succeed = await http.login("/api/user/login", name, password);
    if (succeed) {
      this.props.history.replace("/dashboard");
    }
  }

  public render(): ReactNode {
    let node = (
      <form styleName="login">
        <Input label="ユーザー名" onChange={(value) => this.setState({name: value})}/>
        <Input label="パスワード" type="password" onChange={(value) => this.setState({password: value})}/>
        <div styleName="button-group">
          <Button value="ログイン" onClick={this.performLogin.bind(this)}/>
          <Button value="新規登録" color="green"/>
        </div>
      </form>
    );
    return node;
  }

}


type Props = {
};
type State = {
  name: string,
  password: string
};

export let LoginForm = withRouter(LoginFormBase);