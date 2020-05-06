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
  route
} from "/client/component/decorator";
import {
  getMessage
} from "/client/component/message";
import {
  createValidate
} from "/client/util/misc";
import {
  EMAIL_REGEXP,
  validatePassword as rawValidatePassword
} from "/server/model/validation";


@route @inject
@applyStyle(require("./reset-user-password-form.scss"))
export class ResetUserPasswordForm extends StoreComponent<Props, State> {

  public state: State = {
    email: "",
    password: "",
    errorType: null,
    errorStyle: "error"
  };

  private async issueResetToken(): Promise<void> {
    let email = this.state.email;
    let response = await this.requestPost("issueUserResetToken", {email}, true);
    let body = response.data;
    if (response.status === 200) {
      this.setState({errorType: "userResetTokenIssued", errorStyle: "information"});
    } else if (response.status === 400 && "error" in body) {
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
    let validate = createValidate(EMAIL_REGEXP, getMessage("invalidEmail"));
    let node = (
      <FormPane errorType={this.state.errorType} errorStyle={this.state.errorStyle} onErrorClose={() => this.setState({errorType: null})}>
        <form styleName="root">
          <Input label="メールアドレス" value={this.state.email} validate={validate} onSet={(email) => this.setState({email})}/>
          <div styleName="button-group">
            <div styleName="row">
              <Button label="送信" reactive={true} onClick={this.issueResetToken.bind(this)}/>
            </div>
          </div>
        </form>
      </FormPane>
    );
    return node;
  }

  private renderResetPasswordForm(): ReactNode {
    let validate = createValidate(rawValidatePassword, getMessage("invalidPassword"));
    let node = (
      <FormPane errorType={this.state.errorType} errorStyle={this.state.errorStyle} onErrorClose={() => this.setState({errorType: null})}>
        <form styleName="root">
          <Input label="新しいパスワード" value={this.state.password} validate={validate} onSet={(password) => this.setState({password})}/>
          <div styleName="button-group">
            <div styleName="row">
              <Button label="変更" reactive={true} onClick={this.resetPassword.bind(this)}/>
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
  email: string,
  password: string,
  errorType: string | null,
  errorStyle: "error" | "information"
};