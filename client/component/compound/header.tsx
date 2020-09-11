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
  intl,
  route
} from "/client/component/decorator";


@route @inject @intl
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
      <HeaderMenuItem label={"@" + this.state.userName} href="/dashboard"/>
    );
    let languageNode = (
      <div styleName="language">
        <span styleName="icon">&#xF1AB;</span>
        <span styleName="link" onClick={() => this.props.store!.changeLocale("ja")}>Ja</span> · <span styleName="link" onClick={() => this.props.store!.changeLocale("en")}>En</span>
      </div>
    );
    let node = (
      <header styleName="root">
        <div styleName="container">
          <div styleName="left">
            <div styleName="title">
              <Link href="/" style="plane">ZpDIC</Link>
            </div>
            <div styleName="menu">
              <HeaderMenuItem label={this.trans("header.dictionaryList")} iconLabel="&#xF02D;" href="/list"/>
              <HeaderMenuItem label={this.trans("header.notification")} iconLabel="&#xF05A;" href="/notification"/>
              <HeaderMenuItem label={this.trans("header.contact")} iconLabel="&#xF0E0;" href="/contact"/>
            </div>
            {languageNode}
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