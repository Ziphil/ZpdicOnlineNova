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
  EMAIL_REGEXP
} from "/server/model/validation";


@route @inject
@applyStyle(require("./login-form.scss"))
export class IssueUserResetTokenForm extends StoreComponent<Props, State> {

  public state: State = {
    email: "",
    errorType: null
  };

  private async performResetPassword(): Promise<void> {
    let email = this.state.email;
    let response = await this.requestPost("issueUserResetToken", {email}, true);
    let body = response.data;
    if (response.status === 200) {
      console.log("succeeded");
    } else if (response.status === 400 && "error" in body) {
      this.setState({errorType: body.type});
    } else {
      this.setState({errorType: "unexpected"});
    }
  }

  public render(): ReactNode {
    let validateEmail = createValidate(EMAIL_REGEXP, getMessage("invalidEmail"));
    let node = (
      <FormPane errorType={this.state.errorType} onErrorClose={() => this.setState({errorType: null})}>
        <form styleName="root">
          <Input label="メールアドレス" value={this.state.email} validate={validateEmail} onSet={(email) => this.setState({email})}/>
          <div styleName="button-group">
            <Button label="送信" reactive={true} onClick={this.performResetPassword.bind(this)}/>
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
  email: string,
  errorType: string | null
};