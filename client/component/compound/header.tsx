//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  Link
} from "/client/component/atom";
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


@route @inject
@applyStyle(require("./header.scss"))
export class Header extends StoreComponent<Props, State> {

  public state: State = {
    userName: ""
  };

  public async componentDidMount(): Promise<void> {
    let user = this.props.store!.user;
    if (user) {
      let userName = user.name;
      this.setState({userName});
    }
  }

  public render(): ReactNode {
    let node = (
      <div styleName="root">
        <div styleName="container">
          <div styleName="left">
            <div styleName="title">
              <Link label="ZpDIC" href="/" style="plane"/>
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