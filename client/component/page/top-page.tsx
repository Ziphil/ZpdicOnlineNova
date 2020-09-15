//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  StoreComponent
} from "/client/component/component";
import DictionaryAggregationPane from "/client/component/compound/dictionary-aggregation-pane";
import LoginForm from "/client/component/compound/login-form";
import Logo from "/client/component/compound/logo";
import NotificationList from "/client/component/compound/notification-list";
import {
  applyStyle,
  route
} from "/client/component/decorator";
import Page from "/client/component/page/page";


@route
@applyStyle(require("./top-page.scss"))
export default class TopPage extends StoreComponent<Props, State> {

  public render(): ReactNode {
    let node = (
      <Page>
        <div styleName="logo-wrapper">
          <div styleName="logo">
            <Logo/>
          </div>
          <div styleName="login-form">
            <LoginForm showRegister={true}/>
          </div>
        </div>
        <div styleName="aggregation">
          <DictionaryAggregationPane/>
        </div>
        <div styleName="notification">
          <NotificationList size={3} showPagination={false}/>
        </div>
      </Page>
    );
    return node;
  }

}


type Props = {
};
type State = {
};