//

import * as react from "react";
import {
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
  FormPane
} from "/client/component/compound";
import {
  applyStyle,
  inject,
  intl,
  route
} from "/client/component/decorator";


@route @inject @intl
@applyStyle(require("./login-form.scss"))
export class LoginForm extends StoreComponent<Props, State> {

  public state: State = {
    name: "",
    password: "",
    errorType: null
  };

  private async performLogin(): Promise<void> {
    let name = this.state.name;
    let password = this.state.password;
    let response = await this.login({name, password}, true);
    if (response.status === 200) {
      this.replacePath("/dashboard");
    } else {
      this.setState({errorType: "loginFailed"});
    }
  }

  private async jumpRegister(): Promise<void> {
    let name = this.state.name;
    let password = this.state.password;
    this.pushPath("/register", {name, password});
  }

  private async jumpResetPassword(): Promise<void> {
    let name = this.state.name;
    this.pushPath("/reset", {name});
  }

  public render(): ReactNode {
    let registerNode = (this.props.showsRegister) && (
      <Button label={this.trans("registerForm.register")} iconLabel="&#xF234;" style="simple" onClick={this.jumpRegister.bind(this)}/>
    );
    let node = (
      <FormPane errorType={this.state.errorType} onErrorClose={() => this.setState({errorType: null})}>
        <form styleName="root">
          <Input label={this.trans("loginForm.userName")} value={this.state.name} onSet={(name) => this.setState({name})}/>
          <Input label={this.trans("loginForm.password")} type="flexible" value={this.state.password} onSet={(password) => this.setState({password})}/>
          <div styleName="button-group">
            <div styleName="row">
              <Button label={this.trans("loginForm.login")} iconLabel="&#xF2F6;" style="information" reactive={true} onClick={this.performLogin.bind(this)}/>
              {registerNode}
            </div>
            <div styleName="row">
              <Button label={this.trans("loginForm.resetPassword")} iconLabel="&#xF128;" style="simple" onClick={this.jumpResetPassword.bind(this)}/>
            </div>
          </div>
        </form>
      </FormPane>
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