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
  EMAIL_REGEXP
} from "/server/model/validation";


@style(require("./change-user-email-form.scss"))
export default class ChangeUserEmailForm extends Component<Props, State> {

  public constructor(props: any) {
    super(props);
    let email = this.props.currentEmail;
    this.state = {email};
  }

  private async handleClick(): Promise<void> {
    let email = this.state.email;
    let response = await this.request("changeUserEmail", {email});
    if (response.status === 200) {
      this.props.store!.addInformationPopup("userEmailChanged");
      if (this.props.onSubmit) {
        this.props.onSubmit();
      }
    }
  }

  public render(): ReactNode {
    let validate = createValidate(EMAIL_REGEXP, PopupUtil.getMessage(this.props.intl!, "invalidUserEmail"));
    let node = (
      <form styleName="root">
        <Input label={this.trans("changeUserEmailForm.email")} value={this.state.email} validate={validate} useTooltip={true} onSet={(email) => this.setState({email})}/>
        <Button label={this.trans("changeUserEmailForm.confirm")} reactive={true} onClick={this.handleClick.bind(this)}/>
      </form>
    );
    return node;
  }

}


type Props = {
  currentEmail: string,
  onSubmit?: () => void
};
type State = {
  email: string
};