//

import * as react from "react";
import {
  Fragment,
  ReactNode
} from "react";
import Button from "/client/component/atom/button";
import Input from "/client/component/atom/input";
import Component from "/client/component/component";
import UserList from "/client/component/compound/user-list";
import UserSuggestionPane from "/client/component/compound/user-suggestion-pane";
import {
  style
} from "/client/component/decorator";
import {
  Dictionary
} from "/server/skeleton/dictionary";
import {
  User
} from "/server/skeleton/user";


@style(require("./invite-edit-dictionary-form.scss"))
export default class InviteEditDictionaryForm extends Component<Props, State> {

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
    let response = await this.requestGet("fetchDictionaryAuthorizedUsers", {number, authority});
    if (response.status === 200 && !("error" in response.data)) {
      let authorizedUsers = response.data;
      this.setState({authorizedUsers});
    } else {
      this.setState({authorizedUsers: null});
    }
  }

  private async suggestUsers(pattern: string): Promise<Array<{node: ReactNode, replacement: string}>> {
    let response = await this.requestGet("fetchUserSuggestion", {pattern}, true);
    if (response.status === 200 && !("error" in response.data)) {
      let users = response.data;
      let suggestions = users.map((user) => {
        let node = <UserSuggestionPane user={user}/>;
        let replacement = user.name;
        return {node, replacement};
      });
      return suggestions;
    } else {
      return [];
    }
  }

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
      <Fragment>
        <form styleName="root">
          <Input label={this.trans("inviteEditDictionaryForm.userName")} value={this.state.userName} prefix="@" suggest={this.suggestUsers.bind(this)} onSet={(userName) => this.setState({userName})}/>
          <Button label={this.trans("inviteEditDictionaryForm.confirm")} reactive={true} onClick={this.handleClick.bind(this)}/>
        </form>
        <div styleName="user">
          <UserList users={this.state.authorizedUsers} dictionary={this.props.dictionary} size={6} onSubmit={this.fetchAuthorizedUsers.bind(this)}/>
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