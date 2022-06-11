//

import * as react from "react";
import {
  ReactElement,
  ReactNode,
  useState
} from "react";
import NotificationPane from "/client/component/compound/notification-pane";
import PaneList from "/client/component/compound/pane-list-beta";
import {
  create
} from "/client/component/create";
import {
  useSuspenseQuery
} from "/client/component/hook";
import {
  Notification
} from "/client/skeleton/notification";
import {
  calcOffset
} from "/client/util/misc";


const NotificationList = create(
  require("./notification-list.scss"), "NotificationList",
  function ({
    size,
    showPagination
  }: {
    size: number,
    showPagination: boolean
  }): ReactElement {

    let [page, setPage] = useState(0);
    let [[hitNotifications, hitSize]] = useSuspenseQuery("fetchNotifications", calcOffset(page, size), {keepPreviousData: true});

    let renderer = function (notification: Notification): ReactNode {
      return <NotificationPane notification={notification} key={notification.id}/>;
    };
    let node = (
      <PaneList items={hitNotifications} variant="compact" size={size} hitSize={hitSize} page={page} onPageSet={setPage} showPagination={showPagination} renderer={renderer}/>
    );
    return node;

  }
);


export default NotificationList;