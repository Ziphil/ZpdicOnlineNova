//

import * as react from "react";
import {
  Fragment,
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
  Loading,
  UserList
} from "/client/component/compound";
import {
  applyStyle,
  inject,
  route
} from "/client/component/decorator";
import {
  User
} from "/server/skeleton/user";


@route @inject
@applyStyle(require("./invite-edit-dictionary-form.scss"))
export class InviteEditDictionaryForm extends StoreComponent<Props, State> {

  public state: State = {
    userName: "",
    authorizedUsers: null
  };

  public async componentDidMount(): Promise<void> {
    let number = this.props.number;
    let authority = "editOnly";
    let response = await this.requestGet("fetchDictionaryAuthorizedUsers", {number, authority});
    if (response.status === 200 && !("error" in response.data)) {
      let authorizedUsers = response.data;
      this.setState({authorizedUsers});
    } else {
      this.setState({authorizedUsers: null});
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
          <Input label="招待先ユーザー ID" value={this.state.userName} onSet={(userName) => this.setState({userName})}/>
          <Button label="招待" reactive={true} onClick={this.handleClick.bind(this)}/>
        </form>
        <div styleName="user">
          <Loading loading={this.state.authorizedUsers === null}>
            <UserList users={this.state.authorizedUsers!} size={6}/>
          </Loading>
        </div>
      </Fragment>
    );
    return node;
  }

}


type Props = {
  number: number,
  onSubmit?: () => void
};
type State = {
  userName: string,
  authorizedUsers: Array<User> | null
};