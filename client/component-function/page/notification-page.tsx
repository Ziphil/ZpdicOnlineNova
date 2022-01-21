//

import * as react from "react";
import {
  ReactElement
} from "react";
import NotificationList from "/client/component-function/compound/notification-list";
import {
  create
} from "/client/component-function/create";
import Page from "/client/component-function/page/page";


const NotificationPage = create(
  require("./notification-page.scss"), "NotificationPage",
  function ({
  }: {
  }): ReactElement {

    let node = (
      <Page>
        <div styleName="list">
          <NotificationList size={10} showPagination={true}/>
        </div>
      </Page>
    );
    return node;

  }
);


export default NotificationPage;