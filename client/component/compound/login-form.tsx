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
    errorType: null
  };

  private async performLogin(event: MouseEvent<HTMLInputElement>): Promise<void> {
    let name = this.state.name;
    let password = this.state.password;
    let succeeded = await http.login({name, password});
    if (succeeded) {
      this.props.history.replace("/dashboard");
    } else {
      this.setState({errorType: "loginFailed"});
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
    let errorType = this.state.errorType;
    if (errorType) {
      let text = "予期せぬエラーです。";
      if (errorType === "loginFailed") {
        text = "ログインに失敗しました。";
      }
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
          <Input label="ユーザー名" onSet={(value) => this.setState({name: value})}/>
          <Input label="パスワード" type="flexible" onSet={(value) => this.setState({password: value})}/>
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
  errorType: string | null
};

export let LoginForm = withRouter(LoginFormBase);