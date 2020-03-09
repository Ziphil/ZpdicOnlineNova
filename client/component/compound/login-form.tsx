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
  InformationPane
} from "/client/component/compound";
import {
  applyStyle
} from "/client/util/decorator";
import * as http from "/client/util/http";


@applyStyle(require("./login-form.scss"))
class LoginFormBase extends ComponentBase<Props, State> {

  public state: State = {
    name: "",
    password: "",
    error: false
  };

  private async performLogin(event: MouseEvent<HTMLInputElement>): Promise<void> {
    let name = this.state.name;
    let password = this.state.password;
    let succeeded = await http.login({name, password});
    if (succeeded) {
      this.props.history.replace("/dashboard");
    } else {
      this.setState({error: true});
    }
  }

  private async jumpRegister(event: MouseEvent<HTMLInputElement>): Promise<void> {
    this.props.history.replace("/register");
  }

  public render(): ReactNode {
    let registerNode;
    if (this.props.showsRegister) {
      registerNode = <Button label="新規登録" color="simple" onClick={this.jumpRegister.bind(this)}/>;
    }
    let errorNode;
    if (this.state.error) {
      let text = "ログインに失敗しました。";
      errorNode = (
        <div styleName="error">
          <InformationPane texts={[text]} color="error"/>
        </div>
      );
    }
    let node = (
      <div>
        {errorNode}
        <form styleName="root">
          <Input label="ユーザー名" onValueChange={(value) => this.setState({name: value})}/>
          <Input label="パスワード" type="flexible" onValueChange={(value) => this.setState({password: value})}/>
          <div styleName="button-group">
            <Button label="ログイン" onClick={this.performLogin.bind(this)}/>
            {registerNode}
          </div>
        </form>
      </div>
    );
    return node;
  }

}


type Props = {
  showsRegister: boolean
};
type State = {
  name: string,
  password: string,
  error: boolean
};

export let LoginForm = withRouter(LoginFormBase);