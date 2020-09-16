//

import * as react from "react";
import {
  ReactNode
} from "react";
import Link from "/client/component/atom/link";
import Component from "/client/component/component";
import HeaderMenuItem from "/client/component/compound/header-menu-item";
import {
  style
} from "/client/component/decorator";


@style(require("./header.scss"))
export default class Header extends Component<Props, State> {

  public state: State = {
    userName: null
  };

  public render(): ReactNode {
    let user = this.props.store!.user;
    let userNameNode = (user !== null) && (
      <HeaderMenuItem label={user.screenName} href="/dashboard"/>
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
              <Link href="/" target="self" style="plane">ZpDIC</Link>
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
};