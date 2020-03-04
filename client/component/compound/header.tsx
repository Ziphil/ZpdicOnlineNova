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
  applyStyle
} from "/client/util/decorator";
import * as http from "/client/util/http";


@applyStyle(require("./header.scss"))
class HeaderBase extends ComponentBase<Props, State> {

  public state: State = {
    userName: ""
  };

  public async componentDidMount(): Promise<void> {
    if (http.hasToken()) {
      try {
        let response = await http.get("userInfo", {});
        let userName = response.data.name;
        this.setState({userName});
      } catch (error) {
        this.jumpLogin(error);
      }
    }
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