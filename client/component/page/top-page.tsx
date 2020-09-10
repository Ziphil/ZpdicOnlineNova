//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  StoreComponent
} from "/client/component/component";
import {
  DictionaryAggregationPane,
  LoginForm,
  Logo,
  NotificationList
} from "/client/component/compound";
import {
  applyStyle,
  route
} from "/client/component/decorator";
import {
  Page
} from "/client/component/page/page";


@route
@applyStyle(require("./top-page.scss"))
export class TopPage extends StoreComponent<Props, State> {

  public render(): ReactNode {
    let node = (
      <Page>
        <div styleName="logo-wrapper">
          <div styleName="logo">
            <Logo/>
          </div>
          <div styleName="login-form">
            <LoginForm showsRegister={true}/>
          </div>
        </div>
        <div styleName="aggregation">
          <DictionaryAggregationPane/>
        </div>
        <div styleName="notification">
          <NotificationList size={3} showsPagination={false}/>
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