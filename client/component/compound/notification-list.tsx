//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import NotificationPane from "/client/component/compound/notification-pane";
import PaneList from "/client/component/compound/pane-list";
import {
  style
} from "/client/component/decorator";
import {
  Notification
} from "/client/skeleton/notification";
import {
  WithSize
} from "/server/controller/internal/type";


@style(require("./notification-list.scss"))
export default class NotificationList extends Component<Props, State> {

  private async provideNotifications(offset?: number, size?: number): Promise<WithSize<Notification>> {
    let response = await this.request("fetchNotifications", {offset, size});
    if (response.status === 200) {
      let hitResult = response.data;
      return hitResult;
    } else {
      return [[], 0];
    }
  }

  public render(): ReactNode {
    let renderer = function (notification: Notification): ReactNode {
      return <NotificationPane notification={notification} key={notification.id}/>;
    };
    let node = (
      <PaneList items={this.provideNotifications.bind(this)} size={this.props.size} showPagination={this.props.showPagination} style="compact" renderer={renderer}/>
    );
    return node;
  }

}


type Props = {
  size: number,
  showPagination: boolean
};
type State = {
};