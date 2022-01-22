//

import * as react from "react";
import {
  ReactElement
} from "react";
import Link from "/client/component-function/atom/link";
import HeaderMenuItem from "/client/component-function/compound/header-menu-item";
import {
  create
} from "/client/component-function/create";
import {
  useIntl,
  useUser
} from "/client/component-function/hook";


const Header = create(
  require("./header.scss"), "Header",
  function ({
  }: {
  }): ReactElement {

    let [, {trans}] = useIntl();
    let [user] = useUser();

    let userNameNode = (user !== null) && (
      <HeaderMenuItem label={user.screenName} href="/dashboard"/>
    );
    let node = (
      <header styleName="root">
        <div styleName="container">
          <div styleName="left">
            <div styleName="title">
              <Link href="/" target="self" style="plane">ZpDIC</Link>
            </div>
            <div styleName="menu">
              <HeaderMenuItem label={trans("header.dictionaryList")} iconLabel="&#xF02D;" href="/list"/>
              <HeaderMenuItem label={trans("header.notification")} iconLabel="&#xF05A;" href="/notification"/>
              <HeaderMenuItem label={trans("header.document")} iconLabel="&#xF518;" href="/document"/>
              <HeaderMenuItem label={trans("header.contact")} iconLabel="&#xF0E0;" href="/contact"/>
              <HeaderMenuItem label={trans("header.language")} iconLabel="&#xF1AB;" href="/language"/>
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
);


export default Header;