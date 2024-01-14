//

import {ReactElement} from "react";
import {AdditionalProps, useTrans} from "zographia";
import {NotificationList} from "/client-new/component/compound/notification-list";
import {MainContainer, Page} from "/client-new/component/compound/page";
import {create} from "/client-new/component/create";


export const NotificationListPage = create(
  require("./notification-list-page.scss"), "NotificationListPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("notificationListPage");

    return (
      <Page {...rest}>
        <MainContainer>
          <h2 styleName="heading">{trans("notification")}</h2>
          <NotificationList size={10}/>
        </MainContainer>
      </Page>
    );

  }
);
