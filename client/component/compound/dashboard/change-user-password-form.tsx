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
@applyStyle(require("./change-user-password-form.scss"))
class ChangeUserPasswordFormBase extends StoreComponentBase<Props, State> {

  public state: State = {
    password: ""
  };

  private async click(event: MouseEvent<HTMLElement>): Promise<void> {
    let password = this.state.password;
    let response = await this.requestPost("changeUserPassword", {password});
    if (response.status === 200) {
      this.props.store!.sendInformation("passwordChanged");
      if (this.props.onSubmit) {
        this.props.onSubmit();
      }
    }
  }

  public render(): ReactNode {
    let node = (
      <form styleName="root">
        <Input label="パスワード" type="flexible" onSet={(value) => this.setState({password: value})}/>
        <Button label="変更" onClick={this.click.bind(this)}/>
      </form>
    );
    return node;
  }

}


type Props = {
  onSubmit?: () => void
};
type State = {
  password: string
};

export let ChangeUserPasswordForm = withRouter(ChangeUserPasswordFormBase);