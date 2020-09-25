//

import * as react from "react";
import {
  ReactNode
} from "react";
import Button from "/client/component/atom/button";
import Input from "/client/component/atom/input";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(require("./login-form.scss"))
export default class LoginForm extends Component<Props, State> {

  public state: State = {
    name: "",
    password: ""
  };

  private async performLogin(): Promise<void> {
    let name = this.state.name;
    let password = this.state.password;
    let response = await this.login({name, password}, {ignoreError: true});
    if (response.status === 200) {
      this.replacePath("/dashboard");
    } else {
      this.props.store!.addErrorPopup("loginFailed");
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
    let registerNode = (this.props.showRegister) && (
      <Button label={this.trans("registerForm.confirm")} iconLabel="&#xF234;" style="simple" onClick={this.jumpRegister.bind(this)}/>
    );
    let node = (
      <form styleName="root">
        <Input label={this.trans("loginForm.userName")} value={this.state.name} onSet={(name) => this.setState({name})}/>
        <Input label={this.trans("loginForm.password")} type="flexible" value={this.state.password} onSet={(password) => this.setState({password})}/>
        <div styleName="button-group">
          <div styleName="row">
            <Button label={this.trans("loginForm.confirm")} iconLabel="&#xF2F6;" style="information" reactive={true} onClick={this.performLogin.bind(this)}/>
            {registerNode}
          </div>
          <div styleName="row">
            <Button label={this.trans("loginForm.resetPassword")} iconLabel="&#xF128;" style="simple" onClick={this.jumpResetPassword.bind(this)}/>
          </div>
        </div>
      </form>
    );
    return node;
  }

}


type Props = {
  showRegister: boolean
};
type State = {
  name: string,
  password: string
};