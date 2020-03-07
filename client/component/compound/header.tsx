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
  HeaderMenuItem
} from "/client/component/compound";
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
      <div styleName="root">
        <div styleName="left">
          <div styleName="title">
            <RawLink to="/">ZpDIC</RawLink>
          </div>
          <div styleName="menu">
            <HeaderMenuItem label="辞書一覧" iconLabel="&#xF02D;" href="/dictionary/list"/>
          </div>
        </div>
        <div styleName="right">
          <div styleName="name">
            {this.state.userName}
          </div>
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