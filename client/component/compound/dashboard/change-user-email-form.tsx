//

import {
  inject
} from "mobx-react";
import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import {
  withRouter
} from "react-router-dom";
import {
  Button,
  Input
} from "/client/component/atom";
import {
  StoreComponentBase
} from "/client/component/component";
import {
  applyStyle
} from "/client/util/decorator";


@inject("store")
@applyStyle(require("./change-user-email-form.scss"))
class ChangeUserEmailFormBase extends StoreComponentBase<Props, State> {

  public state: State = {
    email: ""
  };

  public constructor(props: any) {
    super(props);
    let email = this.props.currentEmail;
    this.state = {email};
  }

  private async click(event: MouseEvent<HTMLElement>): Promise<void> {
    let email = this.state.email;
    let response = await this.requestPost("changeUserEmail", {email});
    if (response.status === 200) {
      this.props.store!.sendInformation("emailChanged");
      if (this.props.onSubmit) {
        this.props.onSubmit();
      }
    }
  }

  public render(): ReactNode {
    let node = (
      <form styleName="root">
        <Input label="メールアドレス" initialValue={this.props.currentEmail} onSet={(value) => this.setState({email: value})}/>
        <Button label="変更" onClick={this.click.bind(this)}/>
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

export let ChangeUserEmailForm = withRouter(ChangeUserEmailFormBase);