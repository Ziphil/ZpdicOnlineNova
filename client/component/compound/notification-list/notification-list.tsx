//

import {ReactElement, useState} from "react";
import {AdditionalProps, List, ListBody, ListEmptyView, ListPagination} from "zographia";
import {create} from "/client/component/create";
import {useSuspenseResponse} from "/client/hook/request";
import {calcOffsetSpec} from "/client/util/misc";
import {NotificationCard} from "./notification-card";


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
    const [[hitNotifications, hitSize]] = useSuspenseResponse("fetchNotifications", calcOffsetSpec(page, size), {keepPreviousData: true});

    return (
      <List styleName="root" items={hitNotifications} pageSpec={{size, hitSize, page, onPageSet: setPage}} {...rest}>
        <ListBody styleName="body">
          {(notification) => <NotificationCard key={notification.id} notification={notification}/>}
          <ListEmptyView/>
        </ListBody>
        {(showPagination) && (
          <ListPagination styleName="pagination"/>
        )}
      </List>
    );

  }
);