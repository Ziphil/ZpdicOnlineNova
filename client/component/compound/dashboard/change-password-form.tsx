//

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
  ComponentBase
} from "/client/component/component";
import {
  applyStyle
} from "/client/util/decorator";
import * as http from "/client/util/http";


@applyStyle(require("./change-password-form.scss"))
class ChangePasswordFormBase extends ComponentBase<Props, State> {

  public state: State = {
    password: ""
  };

  private async click(event: MouseEvent<HTMLElement>): Promise<void> {
    let password = this.state.password;
    let dictionary = await http.post("changePassword", {password});
    if (this.props.onSubmit) {
      this.props.onSubmit();
    }
  }

  public render(): ReactNode {
    let node = (
      <form styleName="root">
        <Input label="パスワード" type="flexible" onValueChange={(value) => this.setState({password: value})}/>
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
  password: string;
};

export let ChangePasswordForm = withRouter(ChangePasswordFormBase);