//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  Markdown
} from "/client/component/atom";
import {
  Component
} from "/client/component/component";
import {
  applyStyle
} from "/client/component/decorator";
import {
  DateUtil
} from "/client/util/date";
import {
  Notification
} from "/server/skeleton/notification";


@applyStyle(require("./notification-pane.scss"))
export class NotificationPane extends Component<Props, State> {

  public render(): ReactNode {
    let styles = this.props.styles!;
    let iconString = (() => {
      let type = this.props.notification.type;
      if (type === "update") {
        return "\uF005";
      } else if (type === "bug") {
        return "\uF974";
      } else if (type === "bugFixed") {
        return "\uF975";
      } else {
        return "\uF05A";
      }
    })();
    let dateString = DateUtil.format(this.props.notification.date, "yyyy/MM/dd HH:mm");
    let fixedString = (this.props.notification.type === "bugFixed") ? " (対処済み)" : "";
    let node = (
      <div styleName="root">
        <div styleName="head-wrapper">
          <div styleName="icon">{iconString}</div>
          <div styleName="head-right">
            <div styleName="date">{dateString}</div>
            <h1 styleName="head">{this.props.notification.title}{fixedString}</h1>
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