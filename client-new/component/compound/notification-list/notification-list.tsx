//

import {ReactElement, useState} from "react";
import {AdditionalProps, List, ListBody, ListEmptyView, ListPagination} from "zographia";
import {create} from "/client-new/component/create";
import {useSuspenseQuery} from "/client-new/hook/request";
import {calcOffsetSpec} from "/client-new/util/misc";
import {NotificationPane} from "./notification-pane";


export const NotificationList = create(
  require("./notification-list.scss"), "NotificationList",
  function ({
    size,
    showPagination = true,
    ...rest
  }: {
    size: number,
    showPagination?: boolean,
    className?: string
  } & AdditionalProps): ReactElement {

    const [page, setPage] = useState(0);
    const [[hitNotifications, hitSize]] = useSuspenseQuery("fetchNotifications", calcOffsetSpec(page, size), {keepPreviousData: true});

    return (
      <List styleName="root" items={hitNotifications} size={size} hitSize={hitSize} page={page} onPageSet={setPage} {...rest}>
        <ListBody styleName="body">
          {(notification) => <NotificationPane key={notification.id} notification={notification}/>}
          <ListEmptyView/>
        </ListBody>
        {(showPagination) && (
          <ListPagination styleName="pagination"/>
        )}
      </List>
    );

  }
);