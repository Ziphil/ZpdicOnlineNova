//

import * as react from "react";
import {
  MouseEvent,
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
  applyStyle,
  inject,
  route
} from "/client/component/decorator";


@route @inject
@applyStyle(require("./change-user-email-form.scss"))
export class ChangeUserEmailForm extends StoreComponent<Props, State> {

  public constructor(props: any) {
    super(props);
    let email = this.props.currentEmail;
    this.state = {email};
  }

  private async handleClick(event: MouseEvent<HTMLElement>): Promise<void> {
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
        <Input label="メールアドレス" value={this.state.email} onSet={(email) => this.setState({email})}/>
        <Button label="変更" reactive={true} onClick={this.handleClick.bind(this)}/>
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