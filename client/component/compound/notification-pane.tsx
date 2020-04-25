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
  NotificationSkeleton
} from "/server/skeleton/notification";


@applyStyle(require("./notification-pane.scss"))
export class NotificationPane extends Component<Props, State> {

  public render(): ReactNode {
    let type = this.props.notification.type;
    let iconString = "\uF05A";
    if (type === "update") {
      iconString = "\uF005";
    } else if (type === "error") {
      iconString = "\uF188";
    }
    let dateString = DateUtil.format(this.props.notification.date, "yyyy/MM/dd HH:mm");
    let node = (
      <div styleName="root">
        <div styleName="head-wrapper">
          <div styleName="icon">{iconString}</div>
          <div styleName="head-right">
            <div styleName="date">{dateString}</div>
            <h1 styleName="head">{this.props.notification.title}</h1>
          </div>
        </div>
        <Markdown source={this.props.notification.text}/>
      </div>
    );
    return node;
  }

}


type Props = {
  notification: NotificationSkeleton
};
type State = {
};