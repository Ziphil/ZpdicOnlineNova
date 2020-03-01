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
class RegisterFormBase extends ComponentBase<Props, State> {

  public state: State = {
    name: "",
    email: "",
    password: "",
    passwordRepeat: ""
  };

  private async performRegister(event: MouseEvent<HTMLInputElement>): Promise<void> {
    let name = this.state.name;
    let email = this.state.email;
    let password = this.state.password;
    let passwordRepeat = this.state.passwordRepeat;
    if (password === passwordRepeat) {
      console.log("Not implemented");
    }
  }

  public render(): ReactNode {
    let node = (
      <form styleName="login">
        <Input label="ユーザー名" onChange={(value) => this.setState({name: value})}/>
        <Input label="メールアドレス" onChange={(value) => this.setState({email: value})}/>
        <Input label="パスワード" type="password" onChange={(value) => this.setState({password: value})}/>
        <Input label="パスワード (確認)" type="password" onChange={(value) => this.setState({passwordRepeat: value})}/>
        <div styleName="button-group">
          <Button value="新規登録" onClick={this.performRegister.bind(this)}/>
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
  email: string,
  password: string,
  passwordRepeat: string
};

export let RegisterForm = withRouter(RegisterFormBase);