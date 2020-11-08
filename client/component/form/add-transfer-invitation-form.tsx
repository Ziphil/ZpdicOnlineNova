//

import * as react from "react";
import {
  Fragment,
  ReactNode
} from "react";
import Button from "/client/component/atom/button";
import Input from "/client/component/atom/input";
import {
  SuggestionSpec
} from "/client/component/atom/suggestion";
import Component from "/client/component/component";
import UserSuggestionPane from "/client/component/compound/user-suggestion-pane";
import {
  style
} from "/client/component/decorator";
import {
  Dictionary
} from "/server/skeleton/dictionary";


@style(require("./add-transfer-invitation-form.scss"))
export default class AddTransferInvitationForm extends Component<Props, State> {

  public state: State = {
    userName: ""
  };

  private async suggestUsers(pattern: string): Promise<Array<SuggestionSpec<string>>> {
    let response = await this.requestGet("suggestUsers", {pattern}, {ignoreError: true});
    if (response.status === 200 && !("error" in response.data)) {
      let users = response.data;
      let suggestions = users.map((user) => {
        let replacement = user.name;
        let node = <UserSuggestionPane user={user}/>;
        return {replacement, node};
      });
      return suggestions;
    } else {
      return [];
    }
  }

  private async handleClick(): Promise<void> {
    let number = this.props.number;
    let userName = this.state.userName;
    let type = "transfer";
    let response = await this.requestPost("addInvitation", {number, type, userName});
    if (response.status === 200) {
      this.props.store!.addInformationPopup("transferInvitationAdded");
      if (this.props.onSubmit) {
        this.props.onSubmit();
      }
    }
  }

  public render(): ReactNode {
    let node = (
      <Fragment>
        <form styleName="root">
          <Input
            label={this.trans("addTransferInvitationForm.userName")}
            value={this.state.userName}
            prefix="@"
            suggest={this.suggestUsers.bind(this)}
            onSet={(userName) => this.setState({userName})}
          />
          <Button label={this.trans("addTransferInvitationForm.confirm")} reactive={true} onClick={this.handleClick.bind(this)}/>
        </form>
      </Fragment>
    );
    return node;
  }

}


type Props = {
  number: number,
  dictionary: Dictionary,
  onSubmit?: () => void
};
type State = {
  userName: string
};