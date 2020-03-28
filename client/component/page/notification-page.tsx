//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  StoreComponent
} from "/client/component/component";
import {
  Loading,
  NotificationList
} from "/client/component/compound";
import {
  applyStyle,
  inject,
  route
} from "/client/component/decorator";
import {
  Page
} from "/client/component/page/page";
import {
  NotificationSkeleton
} from "/server/skeleton/notification";


@route @inject
@applyStyle(require("./notification-page.scss"))
export class NotificationPage extends StoreComponent<Props, State> {

  public state: State = {
    notifications: null
  };

  public async componentDidMount(): Promise<void> {
    let response = await this.requestGet("fetchNotifications", {});
    if (response.status === 200) {
      let notifications = response.data;
      this.setState({notifications});
    }
  }

  public render(): ReactNode {
    let node = (
      <Page>
        <div styleName="list">
          <Loading loading={this.state.notifications === null}>
            <NotificationList notifications={this.state.notifications!} size={10} offset={0}/>
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
  notifications: Array<NotificationSkeleton> | null;
};