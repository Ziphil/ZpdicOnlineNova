//

import * as react from "react";
import {
  ReactElement
} from "react";
import NotificationList from "/client/component/compound/notification-list";
import {
  create
} from "/client/component/create";
import {
  useIntl
} from "/client/component/hook";
import Page from "/client/component/page/page";


const NotificationPage = create(
  require("./notification-page.scss"), "NotificationPage",
  function ({
  }: {
  }): ReactElement {

    let [, {trans}] = useIntl();

    let node = (
      <Page title={trans("notificationPage.title")}>
        <div styleName="list">
          <NotificationList size={10} showPagination={true}/>
        </div>
      </Page>
    );
    return node;

  }
);


export default NotificationPage;