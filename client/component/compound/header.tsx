//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  Link as RawLink
} from "react-router-dom";
import {
  StoreComponent
} from "/client/component/component";
import {
  HeaderMenuItem
} from "/client/component/compound";
import {
  applyStyle,
  inject,
  route
} from "/client/util/decorator";
import * as http from "/client/util/http";


@route @inject
@applyStyle(require("./header.scss"))
export class Header extends StoreComponent<Props, State> {

  public state: State = {
    userName: ""
  };

  public async componentDidMount(): Promise<void> {
    if (http.hasToken()) {
      let response = await this.requestGet("fetchUserInfo", {}, true);
      if (response.status === 200) {
        let userName = response.data.name;
        this.setState({userName});
      }
    }
  }

  public render(): ReactNode {
    let node = (
      <div styleName="root">
        <div styleName="container">
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