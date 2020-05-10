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
  PaginationButton
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
    notifications: null,
    page: 0
  };

  public async componentDidMount(): Promise<void> {
    let size = (this.props.showsPagination) ? undefined : this.props.size;
    let response = await this.requestGet("fetchNotifications", {size});
    if (response.status === 200) {
      let notifications = response.data;
      let page = 0;
      this.setState({notifications, page});
    }
  }

  private renderNotificationPanes(): ReactNode {
    let offset = this.props.size * this.state.page;
    let maxPage = Math.max(Math.ceil(this.state.notifications!.length / this.props.size) - 1, 0);
    let displayedNotifications = this.state.notifications!.slice(offset, offset + this.props.size);
    let notificationPanes = displayedNotifications.map((notification) => {
      return <NotificationPane notification={notification} key={notification.id}/>;
    });
    let paginationNodes = (this.props.showsPagination) && (
      <div styleName="pagination-button">
        <PaginationButton page={this.state.page} minPage={0} maxPage={maxPage} onSet={(page) => this.setState({page})}/>
      </div>
    );
    let node = (
      <Fragment>
        <div styleName="notification">
          {notificationPanes}
        </div>
        {paginationNodes}
      </Fragment>
    );
    return node;
  }

  public render(): ReactNode {
    let notificationPanes = (this.state.notifications) && this.renderNotificationPanes();
    let node = (
      <div styleName="root">
        <Loading loading={this.state.notifications === null}>
          {notificationPanes}
        </Loading>
      </div>
    );
    return node;
  }

}


type Props = {
  size: number,
  showsPagination: boolean
};
type State = {
  notifications: Array<Notification> | null,
  page: number
};