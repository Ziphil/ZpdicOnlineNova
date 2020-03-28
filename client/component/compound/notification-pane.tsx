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
  NotificationSkeleton
} from "/server/skeleton/notification";


@applyStyle(require("./notification-pane.scss"))
export class NotificationPane extends Component<Props, State> {

  public render(): ReactNode {
    let iconString = "\uF05A";
    if (this.props.notification.type === "update") {
      iconString = "\uF005";
    }
    let date = new Date(this.props.notification.date);
    let dateString = "";
    dateString += ("0000" + date.getFullYear()).slice(-4);
    dateString += "/";
    dateString += ("00" + (date.getMonth() + 1)).slice(-2);
    dateString += "/";
    dateString += ("00" + date.getDate()).slice(-2);
    dateString += " ";
    dateString += ("00" + date.getHours()).slice(-2);
    dateString += ":";
    dateString += ("00" + date.getMinutes()).slice(-2);
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