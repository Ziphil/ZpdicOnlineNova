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
@applyStyle(require("./invite-edit-dictionary-form.scss"))
export class InviteEditDictionaryForm extends StoreComponent<Props, State> {

  public state: State = {
    userName: ""
  };

  private async handleClick(): Promise<void> {
    let number = this.props.number;
    let userName = this.state.userName;
    let response = await this.requestPost("inviteEditDictionary", {number, userName});
    if (response.status === 200) {
      this.props.store!.addInformationPopup("editDictionaryInvited");
      if (this.props.onSubmit) {
        this.props.onSubmit();
      }
    }
  }

  public render(): ReactNode {
    let node = (
      <form styleName="root">
        <Input label="ユーザー ID" value={this.state.userName} onSet={(userName) => this.setState({userName})}/>
        <Button label="招待" reactive={true} onClick={this.handleClick.bind(this)}/>
      </form>
    );
    return node;
  }

}


type Props = {
  number: number,
  onSubmit?: () => void
};
type State = {
  userName: string
};