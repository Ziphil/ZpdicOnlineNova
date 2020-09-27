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
  validatePassword as rawValidatePassword
} from "/server/model/validation";


@style(require("./reset-user-password-form.scss"))
export default class ResetUserPasswordForm extends Component<Props, State> {

  public state: State = {
    name: "",
    email: "",
    password: ""
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
    let response = await this.requestPost("issueUserResetToken", {name, email}, {useRecaptcha: true});
    if (response.status === 200) {
      this.props.store!.addInformationPopup("userResetTokenIssued");
    }
  }

  private async resetPassword(): Promise<void> {
    let key = this.props.tokenKey!;
    let password = this.state.password;
    let response = await this.requestPost("resetUserPassword", {key, password});
    if (response.status === 200) {
      this.props.store!.addInformationPopup("userPasswordReset");
    }
  }

  private renderIssueResetTokenForm(): ReactNode {
    let node = (
      <form styleName="root">
        <Input label={this.trans("loginForm.userName")} value={this.state.name} onSet={(name) => this.setState({name})}/>
        <Input label={this.trans("loginForm.email")} value={this.state.email} onSet={(email) => this.setState({email})}/>
        <div styleName="button-group">
          <div styleName="row">
            <Button label={this.trans("resetUserPasswordForm.issue")} iconLabel="&#xF0E0;" style="information" reactive={true} onClick={this.issueResetToken.bind(this)}/>
          </div>
        </div>
      </form>
    );
    return node;
  }

  private renderResetPasswordForm(): ReactNode {
    let validate = createValidate(rawValidatePassword, PopupUtil.getMessage(this.props.intl!, "invalidUserPassword"));
    let node = (
      <form styleName="root">
        <Input label={this.trans("resetUserPasswordForm.newPassword")} value={this.state.password} validate={validate} onSet={(password) => this.setState({password})}/>
        <div styleName="button-group">
          <div styleName="row">
            <Button label={this.trans("resetUserPasswordForm.reset")} iconLabel="&#xF00C;" style="information" reactive={true} onClick={this.resetPassword.bind(this)}/>
          </div>
        </div>
      </form>
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
  password: string
};