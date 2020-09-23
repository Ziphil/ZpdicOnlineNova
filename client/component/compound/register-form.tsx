//

import * as react from "react";
import {
  ReactNode
} from "react";
import Button from "/client/component/atom/button";
import Input from "/client/component/atom/input";
import Component from "/client/component/component";
import FormPane from "/client/component/compound/form-pane";
import {
  style
} from "/client/component/decorator";
import {
  Main
} from "/client/index";
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
    password: "",
    errorType: null
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
    let recaptchaToken = await grecaptcha.execute(Main.getRecaptchaSite(), {action: "registerUser"});
    let response = await this.requestPost("registerUser", {name, email, password, recaptchaToken}, true);
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
    let validateName = createValidate(IDENTIFIER_REGEXP, PopupUtil.getMessage(this.props.intl!, "invalidUserName"));
    let validateEmail = createValidate(EMAIL_REGEXP, PopupUtil.getMessage(this.props.intl!, "invalidUserEmail"));
    let validatePassword = createValidate(rawValidatePassword, PopupUtil.getMessage(this.props.intl!, "invalidUserPassword"));
    let node = (
      <FormPane errorType={this.state.errorType} onErrorClose={() => this.setState({errorType: null})}>
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
      </FormPane>
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