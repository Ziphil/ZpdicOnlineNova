//

import * as react from "react";
import {
  ReactNode
} from "react";
import Markdown from "/client/component/atom/markdown";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";
import {
  Notification
} from "/server/skeleton/notification";


@style(require("./notification-pane.scss"))
export default class NotificationPane extends Component<Props, State> {

  public render(): ReactNode {
    let styles = this.props.styles!;
    let fixedNode = (this.props.notification.type === "bugFixed") && (
      <span styleName="fixed">({this.trans("notificationPane.fixed")})</span>
    );
    let iconString = (() => {
      let type = this.props.notification.type;
      if (type === "update") {
        return "\uF005";
      } else if (type === "bug") {
        return "\uE074";
      } else if (type === "bugFixed") {
        return "\uE075";
      } else {
        return "\uF05A";
      }
    })();
    let node = (
      <div styleName="root">
        <div styleName="head-wrapper">
          <div styleName="icon">{iconString}</div>
          <div styleName="head-right">
            <div styleName="date">{this.transDate(this.props.notification.date)}</div>
            <h1 styleName="head">
              {fixedNode}
              {this.props.notification.title}
            </h1>
          </div>
        </div>
        <Markdown className={styles["content"]} source={this.props.notification.text}/>
      </div>
    );
    return node;
  }

}


type Props = {
  notification: Notification
};
type State = {
};