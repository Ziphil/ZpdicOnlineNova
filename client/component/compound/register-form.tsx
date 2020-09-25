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
import {
  createValidate
} from "/client/util/misc";
import {
  PopupUtil
} from "/client/util/popup";
import {
  EMAIL_REGEXP,
  IDENTIFIER_REGEXP,
  validatePassword as rawValidatePassword
} from "/server/model/validation";


@style(require("./register-form.scss"))
export default class RegisterForm extends Component<Props, State> {

  public state: State = {
    name: "",
    email: "",
    password: ""
  };

  public componentDidMount(): void {
    let name = this.props.location!.state?.name;
    let password = this.props.location!.state?.password;
    if (name !== undefined && password !== undefined) {
      this.setState({name, password});
    }
  }

  private async performRegister(): Promise<void> {
    let name = this.state.name;
    let email = this.state.email;
    let password = this.state.password;
    let response = await this.requestPost("registerUser", {name, email, password}, {useRecaptcha: true});
    let body = response.data;
    if (response.status === 200) {
      let loginResponse = await this.login({name, password});
      if (loginResponse.status === 200) {
        this.replacePath("/dashboard");
      } else {
        this.props.store!.addErrorPopup("loginFailed");
      }
    }
  }

  public render(): ReactNode {
    let validateName = createValidate(IDENTIFIER_REGEXP, PopupUtil.getMessage(this.props.intl!, "invalidUserName"));
    let validateEmail = createValidate(EMAIL_REGEXP, PopupUtil.getMessage(this.props.intl!, "invalidUserEmail"));
    let validatePassword = createValidate(rawValidatePassword, PopupUtil.getMessage(this.props.intl!, "invalidUserPassword"));
    let node = (
      <form styleName="root">
        <Input label={this.trans("loginForm.userName")} value={this.state.name} validate={validateName} onSet={(name) => this.setState({name})}/>
        <Input label={this.trans("loginForm.email")} value={this.state.email} validate={validateEmail} onSet={(email) => this.setState({email})}/>
        <Input label={this.trans("loginForm.password")} type="flexible" value={this.state.password} validate={validatePassword} onSet={(password) => this.setState({password})}/>
        <div styleName="button-group">
          <div styleName="row">
            <Button label={this.trans("registerForm.register")} iconLabel="&#xF234;" style="information" reactive={true} onClick={this.performRegister.bind(this)}/>
          </div>
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
  password: string
};