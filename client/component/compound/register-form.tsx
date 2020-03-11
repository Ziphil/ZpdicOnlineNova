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
class RegisterFormBase extends StoreComponentBase<Props, State> {

  public state: State = {
    name: "",
    email: "",
    password: "",
    errorType: null
  };

  private async performRegister(event: MouseEvent<HTMLInputElement>): Promise<void> {
    let name = this.state.name;
    let email = this.state.email;
    let password = this.state.password;
    let response = await this.requestPost("registerUser", {name, email, password}, true);
    let body = response.data;
    if (response.status === 200) {
      let loginResponse = await this.login({name, password});
      if (loginResponse.status === 200) {
        this.props.history.replace("/dashboard");
      } else {
        this.setState({errorType: "loginFailed"});
      }
    } else if (response.status === 400 && "error" in body) {
      this.setState({errorType: body.type});
    } else {
      this.setState({errorType: "unexpected"});
    }
  }

  public render(): ReactNode {
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
          <Input label="メールアドレス" onSet={(value) => this.setState({email: value})}/>
          <Input label="パスワード" type="flexible" onSet={(value) => this.setState({password: value})}/>
          <div styleName="button-group">
            <Button label="新規登録" onClick={this.performRegister.bind(this)}/>
          </div>
        </form>
      </div>
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
  errorType: string | null
};

export let RegisterForm = withRouter(RegisterFormBase);