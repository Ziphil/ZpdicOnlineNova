//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import DictionaryAggregationPane from "/client/component/compound/dictionary-aggregation-pane";
import LoginForm from "/client/component/compound/login-form";
import Logo from "/client/component/compound/logo";
import NotificationList from "/client/component/compound/notification-list";
import {
  style
} from "/client/component/decorator";
import Page from "/client/component/page/page";


@style(require("./top-page.scss"))
export default class TopPage extends Component<Props, State> {

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