//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  Link as RawLink,
  withRouter
} from "react-router-dom";
import {
  ComponentBase
} from "/client/component/component";
import {
  UserBody
} from "/client/type/user";
import {
  applyStyle
} from "/client/util/decorator";
import * as http from "/client/util/http";


@applyStyle(require("./header.scss"))
class HeaderBase extends ComponentBase<Props, State> {

  public state: State = {
    userName: ""
  };

  public componentDidMount(): void {
    this.inPrivate(async () => {
      let response = await http.get<UserBody>("/api/user/info");
      let name = response.data.name;
      this.setState({userName: name});
    });
  }

  public render(): ReactNode {
    let node = (
      <div styleName="header">
        <div styleName="left">
          <div styleName="title"><RawLink to="/">ZpDIC</RawLink></div>
        </div>
        <div styleName="right">
          {this.state.userName}
        </div>
      </div>
    );
    return node;
  }

}


type Props = {
};
type State = {
  userName: string
};

export let Header = withRouter(HeaderBase);