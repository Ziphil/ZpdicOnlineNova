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
} from "/client/component/decorator";


@route @inject
@applyStyle(require("./header.scss"))
export class Header extends StoreComponent<Props, State> {

  public state: State = {
    userName: null
  };

  public async componentDidMount(): Promise<void> {
    let user = this.props.store!.user;
    if (user) {
      let userName = user.name;
      this.setState({userName});
    }
  }

  public render(): ReactNode {
    let userNameNode = (this.state.userName !== null) && (
      <div styleName="name">@{this.state.userName}</div>
    );
    let node = (
      <header styleName="root">
        <div styleName="container">
          <div styleName="left">
            <div styleName="title">
              <Link href="/" style="plane">ZpDIC</Link>
            </div>
            <div styleName="menu">
              <HeaderMenuItem label="辞書一覧" iconLabel="&#xF02D;" href="/list"/>
              <HeaderMenuItem label="お知らせ" iconLabel="&#xF05A;" href="/news"/>
            </div>
          </div>
          <div styleName="right">
            {userNameNode}
          </div>
        </div>
      </header>
    );
    return node;
  }

}


type Props = {
};
type State = {
  userName: string | null
};