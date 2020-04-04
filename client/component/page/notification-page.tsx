//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  StoreComponent
} from "/client/component/component";
import {
  NotificationList
} from "/client/component/compound";
import {
  applyStyle,
  inject,
  route
} from "/client/component/decorator";
import {
  Page
} from "/client/component/page/page";


@route @inject
@applyStyle(require("./notification-page.scss"))
export class NotificationPage extends StoreComponent<Props, State> {

  public render(): ReactNode {
    let node = (
      <Page>
        <div styleName="list">
          <NotificationList size={10} showsPagination={true}/>
        </div>
      </Page>
    );
    return node;
  }

}


type Props = {
};
type State = {
};