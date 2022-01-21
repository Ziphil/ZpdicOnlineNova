//

import * as react from "react";
import {
  ReactElement,
  ReactNode,
  useCallback
} from "react";
import NotificationPane from "/client/component-function/compound/notification-pane";
import PaneList from "/client/component-function/compound/pane-list";
import {
  create
} from "/client/component-function/create";
import {
  useRequest
} from "/client/component-function/hook";
import {
  Notification
} from "/client/skeleton/notification";
import {
  WithSize
} from "/server/controller/internal/type";


const NotificationList = create(
  require("./notification-list.scss"), "NotificationList",
  function ({
    size,
    showPagination
  }: {
    size: number,
    showPagination: boolean
  }): ReactElement {

    let {request} = useRequest();

    let provideNotifications = useCallback(async function (offset?: number, size?: number): Promise<WithSize<Notification>> {
      let response = await request("fetchNotifications", {offset, size});
      if (response.status === 200) {
        let hitResult = response.data;
        return hitResult;
      } else {
        return [[], 0];
      }
    }, [request]);

    let renderer = function (notification: Notification): ReactNode {
      return <NotificationPane notification={notification} key={notification.id}/>;
    };
    let node = (
      <PaneList items={provideNotifications} size={size} showPagination={showPagination} style="compact" renderer={renderer}/>
    );
    return node;

  }
);


export default NotificationList;