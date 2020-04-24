//

import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import {
  Button,
  Input
} from "/client/component/atom";
import {
  StoreComponent
} from "/client/component/component";
import {
  InformationPane
} from "/client/component/compound";
import {
  applyStyle,
  inject,
  route
} from "/client/component/decorator";
import {
  getMessage
} from "/client/component/message";


const NAME_VALIDATION = /^[a-zA-Z0-9_-]*[a-zA-Z_-]+[a-zA-Z0-9_-]*$/;
const EMAIL_VALIDATION = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;


@route @inject
@applyStyle(require("./login-form.scss"))
export class RegisterForm extends StoreComponent<Props, State> {

  public state: State = {
    name: "",
    email: "",
    password: "",
    errorType: null
  };

  private async performRegister(event: MouseEvent<HTMLElement>): Promise<void> {
    let name = this.state.name;
    let email = this.state.email;
    let password = this.state.password;
    let response = await this.requestPost("registerUser", {name, email, password}, true);
    let body = response.data;
    if (response.status === 200) {
      let loginResponse = await this.login({name, password});
      if (loginResponse.status === 200) {
        this.replacePath("/dashboard");
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
          <InformationPane texts={[getMessage(errorType)]} style="error" onClose={() => this.setState({errorType: null})}/>
        </div>
      );
    }
    let nameValidate = {regexp: NAME_VALIDATION, message: getMessage("invalidUserName")};
    let emailValidate = {regexp: EMAIL_VALIDATION, message: getMessage("invalidEmail")};
    let passwordValidate = function (password: string): string | null {
      let length = password.length;
      let message = (length < 6 || length > 50) ? getMessage("invalidPassword") : null;
      return message;
    };
    let node = (
      <div>
        {errorNode}
        <form styleName="root">
          <Input label="ユーザー名" value={this.state.name} validate={nameValidate} onSet={(name) => this.setState({name})}/>
          <Input label="メールアドレス" value={this.state.email} validate={emailValidate} onSet={(email) => this.setState({email})}/>
          <Input label="パスワード" type="flexible" value={this.state.password} validate={passwordValidate} onSet={(password) => this.setState({password})}/>
          <div styleName="button-group">
            <Button label="新規登録" reactive={true} onClick={this.performRegister.bind(this)}/>
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