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
  applyStyle,
  intl
} from "/client/component/decorator";
import {
  Notification
} from "/server/skeleton/notification";


@intl
@applyStyle(require("./notification-pane.scss"))
export class NotificationPane extends Component<Props, State> {

  public render(): ReactNode {
    let styles = this.props.styles!;
    let fixedNode = (this.props.notification.type === "bugFixed") && (
      <span styleName="fixed">(対応済み)</span>
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