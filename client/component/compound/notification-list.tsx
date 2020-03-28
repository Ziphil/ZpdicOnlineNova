//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  Component
} from "/client/component/component";
import {
  NotificationPane
} from "/client/component/compound";
import {
  applyStyle
} from "/client/component/decorator";
import {
  NotificationSkeleton
} from "/server/skeleton/notification";


@applyStyle(require("./notification-list.scss"))
export class NotificationList extends Component<Props, State> {

  public render(): ReactNode {
    let notifications = this.props.notifications;
    let displayedNotifications = notifications.slice(this.props.offset, this.props.offset + this.props.size);
    let notificationPanes = displayedNotifications.map((notification) => {
      return <NotificationPane notification={notification} key={notification.id}/>;
    });
    let node = (
      <div styleName="root">
        {notificationPanes}
      </div>
    );
    return node;
  }

}


type Props = {
  notifications: Array<NotificationSkeleton>
  size: number,
  offset: number
};
type State = {
};