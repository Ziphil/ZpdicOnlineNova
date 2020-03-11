//

import {
  inject
} from "mobx-react";
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
  StoreComponentBase
} from "/client/component/component";
import {
  InformationPane
} from "/client/component/compound";
import {
  getMessage
} from "/client/component/message";
import {
  applyStyle
} from "/client/util/decorator";


@inject("store")
@applyStyle(require("./login-form.scss"))
class LoginFormBase extends StoreComponentBase<Props, State> {

  public state: State = {
    name: "",
    password: "",
    errorType: null
  };

  private async performLogin(event: MouseEvent<HTMLInputElement>): Promise<void> {
    let name = this.state.name;
    let password = this.state.password;
    let response = await this.login({name, password}, true);
    if (response.status === 200) {
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
      errorNode = (
        <div styleName="error">
          <InformationPane texts={[getMessage(errorType)]} color="error"/>
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