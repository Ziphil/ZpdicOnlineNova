//

import * as react from "react";
import {
  ReactNode
} from "react";
import Button from "/client/component/atom/button";
import Input from "/client/component/atom/input";
import {
  StoreComponent
} from "/client/component/component";
import FormPane from "/client/component/compound/form-pane";
import {
  applyStyle,
  inject,
  intl,
  route
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
  validatePassword as rawValidatePassword
} from "/server/model/validation";


@route @inject @intl
@applyStyle(require("./reset-user-password-form.scss"))
export default class ResetUserPasswordForm extends StoreComponent<Props, State> {

  public state: State = {
    name: "",
    email: "",
    password: "",
    errorType: null,
    errorStyle: "error"
  };

  public componentDidMount(): void {
    let name = this.props.location!.state?.name;
    if (name !== undefined) {
      this.setState({name});
    }
  }

  private async issueResetToken(): Promise<void> {
    let name = this.state.name;
    let email = this.state.email;
    let token = await grecaptcha.execute(Main.getRecaptchaSite(), {action: "issueUserResetToken"});
    let response = await this.requestPost("issueUserResetToken", {name, email, token}, true);
    let body = response.data;
    if (response.status === 200) {
      this.setState({errorType: "userResetTokenIssued", errorStyle: "information"});
    } else if (response.status === 400 && body !== null && "error" in body) {
      this.setState({errorType: body.type, errorStyle: "error"});
    } else {
      this.setState({errorType: "unexpected", errorStyle: "error"});
    }
  }

  private async resetPassword(): Promise<void> {
    let key = this.props.tokenKey!;
    let password = this.state.password;
    let response = await this.requestPost("resetUserPassword", {key, password}, true);
    let body = response.data;
    if (response.status === 200) {
      this.setState({errorType: "userPasswordReset", errorStyle: "information"});
    } else if (response.status === 400 && "error" in body) {
      this.setState({errorType: body.type, errorStyle: "error"});
    } else {
      this.setState({errorType: "unexpected", errorStyle: "error"});
    }
  }

  private renderIssueResetTokenForm(): ReactNode {
    let node = (
      <FormPane errorType={this.state.errorType} errorStyle={this.state.errorStyle} onErrorClose={() => this.setState({errorType: null})}>
        <form styleName="root">
          <Input label={this.trans("loginForm.userName")} value={this.state.name} onSet={(name) => this.setState({name})}/>
          <Input label={this.trans("loginForm.email")} value={this.state.email} onSet={(email) => this.setState({email})}/>
          <div styleName="button-group">
            <div styleName="row">
              <Button label={this.trans("resetUserPasswordForm.issue")} iconLabel="&#xF0E0;" style="information" reactive={true} onClick={this.issueResetToken.bind(this)}/>
            </div>
          </div>
        </form>
      </FormPane>
    );
    return node;
  }

  private renderResetPasswordForm(): ReactNode {
    let validate = createValidate(rawValidatePassword, PopupUtil.getMessage(this.props.intl!, "invalidUserPassword"));
    let node = (
      <FormPane errorType={this.state.errorType} errorStyle={this.state.errorStyle} onErrorClose={() => this.setState({errorType: null})}>
        <form styleName="root">
          <Input label={this.trans("resetUserPasswordForm.newPassword")} value={this.state.password} validate={validate} onSet={(password) => this.setState({password})}/>
          <div styleName="button-group">
            <div styleName="row">
              <Button label={this.trans("resetUserPasswordForm.reset")} iconLabel="&#xF00C;" style="information" reactive={true} onClick={this.resetPassword.bind(this)}/>
            </div>
          </div>
        </form>
      </FormPane>
    );
    return node;
  }

  public render(): ReactNode {
    let node = (this.props.tokenKey !== null) ? this.renderResetPasswordForm() : this.renderIssueResetTokenForm();
    return node;
  }

}


type Props = {
  tokenKey: string | null
};
type State = {
  name: string,
  email: string,
  password: string,
  errorType: string | null,
  errorStyle: "error" | "information"
};