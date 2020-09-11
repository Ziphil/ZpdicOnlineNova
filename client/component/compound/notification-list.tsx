//

import * as react from "react";
import {
  Fragment,
  ReactNode
} from "react";
import {
  StoreComponent
} from "/client/component/component";
import {
  Loading,
  NotificationPane,
  PaginationButton,
  PaneList
} from "/client/component/compound";
import {
  applyStyle,
  inject,
  route
} from "/client/component/decorator";
import {
  Notification
} from "/server/skeleton/notification";


@route @inject
@applyStyle(require("./notification-list.scss"))
export class NotificationList extends StoreComponent<Props, State> {

  public state: State = {
    notifications: null
  };

  public async componentDidMount(): Promise<void> {
    let size = (this.props.showPagination) ? undefined : this.props.size;
    let response = await this.requestGet("fetchNotifications", {size});
    if (response.status === 200) {
      let notifications = response.data;
      this.setState({notifications});
    }
  }

  public render(): ReactNode {
    let renderer = function (notification: Notification): ReactNode {
      return <NotificationPane notification={notification} key={notification.id}/>;
    };
    let node = (
      <PaneList items={this.state.notifications} size={this.props.size} showPagination={this.props.showPagination} style="compact" renderer={renderer}/>
    );
    return node;
  }

}


type Props = {
  size: number,
  showPagination: boolean
};
type State = {
  notifications: Array<Notification> | null
};