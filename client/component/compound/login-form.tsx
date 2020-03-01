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
  Button,
  Input
} from "/client/component/atom";
import {
  ComponentBase
} from "/client/component/component";
import {
  applyStyle
} from "/client/util/decorator";
import * as http from "/client/util/http";


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
    let registerNode;
    if (this.props.showsRegister) {
      registerNode = <Button value="新規登録" color="green"/>;
    }
    let node = (
      <form styleName="login">
        <Input label="ユーザー名" onChange={(value) => this.setState({name: value})}/>
        <Input label="パスワード" type="password" onChange={(value) => this.setState({password: value})}/>
        <div styleName="button-group">
          <Button value="ログイン" onClick={this.performLogin.bind(this)}/>
          {registerNode}
        </div>
      </form>
    );
    return node;
  }

}


type Props = {
  showsRegister: boolean
};
type State = {
  name: string,
  password: string
};

export let LoginForm = withRouter(LoginFormBase);