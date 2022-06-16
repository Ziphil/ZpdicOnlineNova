//

import * as react from "react";
import {
  ReactElement,
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

    const [page, setPage] = useState(0);
    const [[hitNotifications, hitSize]] = useSuspenseQuery("fetchNotifications", calcOffset(page, size), {keepPreviousData: true});

    const node = (
      <PaneList
        items={hitNotifications}
        variant="compact"
        size={size}
        hitSize={hitSize}
        page={page}
        onPageSet={setPage}
        showPagination={showPagination}
      >
        {(notification) => <NotificationPane key={notification.id} notification={notification}/>}
      </PaneList>
    );
    return node;

  }
);


export default NotificationList;