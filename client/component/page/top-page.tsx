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
  Loading,
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
import {
  NotificationSkeleton
} from "/server/skeleton/notification";


@route
@applyStyle(require("./top-page.scss"))
export class TopPage extends StoreComponent<Props, State> {

  public state: State = {
    notifications: null
  };

  public async componentDidMount(): Promise<void> {
    let size = 2;
    let response = await this.requestGet("fetchNotifications", {size});
    if (response.status === 200) {
      let notifications = response.data;
      this.setState({notifications});
    }
  }

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
          <Loading loading={this.state.notifications === null}>
            <NotificationList notifications={this.state.notifications!} size={2} offset={0}/>
          </Loading>
        </div>
      </Page>
    );
    return node;
  }

}


type Props = {
};
type State = {
  notifications: Array<NotificationSkeleton> | null
};