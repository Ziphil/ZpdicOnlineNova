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
import UserList from "/client/component/compound/user-list";
import UserSuggestionPane from "/client/component/compound/user-suggestion-pane";
import {
  style
} from "/client/component/decorator";
import {
  Dictionary
} from "/client/skeleton/dictionary";
import {
  User
} from "/client/skeleton/user";


@style(require("./add-edit-invitation-form.scss"))
export default class AddEditInvitationForm extends Component<Props, State> {

  public state: State = {
    userName: "",
    authorizedUsers: null
  };

  public async componentDidMount(): Promise<void> {
    await this.fetchAuthorizedUsers();
  }

  private async fetchAuthorizedUsers(): Promise<void> {
    let number = this.props.dictionary.number;
    let authority = "editOnly";
    let response = await this.request("fetchDictionaryAuthorizedUsers", {number, authority});
    if (response.status === 200 && !("error" in response.data)) {
      let authorizedUsers = response.data;
      this.setState({authorizedUsers});
    } else {
      this.setState({authorizedUsers: null});
    }
  }

  private async suggestUsers(pattern: string): Promise<Array<SuggestionSpec<string>>> {
    let response = await this.request("suggestUsers", {pattern}, {ignoreError: true});
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
    let type = "edit";
    let response = await this.request("addInvitation", {number, type, userName});
    if (response.status === 200) {
      this.props.store!.addInformationPopup("editInvitationAdded");
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
            label={this.trans("addEditInvitationForm.userName")}
            value={this.state.userName}
            prefix="@"
            suggest={this.suggestUsers.bind(this)}
            onSet={(userName) => this.setState({userName})}
          />
          <Button label={this.trans("addEditInvitationForm.confirm")} reactive={true} onClick={this.handleClick.bind(this)}/>
        </form>
        <div styleName="user">
          <UserList users={this.state.authorizedUsers} dictionary={this.props.dictionary} size={8} onSubmit={this.fetchAuthorizedUsers.bind(this)}/>
        </div>
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
  userName: string,
  authorizedUsers: Array<User> | null
};