//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import NotificationList from "/client/component/compound/notification-list";
import {
  applyStyle
} from "/client/component/decorator";
import Page from "/client/component/page/page";


@applyStyle(require("./notification-page.scss"))
export default class NotificationPage extends Component<Props, State> {

  public render(): ReactNode {
    let node = (
      <Page>
        <div styleName="list">
          <NotificationList size={10} showPagination={true}/>
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