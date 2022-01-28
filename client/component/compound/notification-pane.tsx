//

import * as react from "react";
import {
  ReactElement
} from "react";
import Icon from "/client/component/atom/icon";
import Markdown from "/client/component/atom/markdown";
import {
  StylesRecord,
  create
} from "/client/component/create";
import {
  useIntl
} from "/client/component/hook";
import {
  Notification
} from "/client/skeleton/notification";


const NotificationPane = create(
  require("./notification-pane.scss"), "NotificationPane",
  function ({
    notification,
    styles
  }: {
    notification: Notification,
    styles?: StylesRecord
  }): ReactElement {

    let [, {trans, transDate}] = useIntl();

    let fixedNode = (notification.type === "bugFixed") && (
      <span styleName="fixed">({trans("notificationPane.fixed")})</span>
    );
    let [iconName, iconSlashed] = (() => {
      let type = notification.type;
      if (type === "update") {
        return ["medal", false] as const;
      } else if (type === "bug") {
        return ["bug", false] as const;
      } else if (type === "bugFixed") {
        return ["bug", true] as const;
      } else {
        return ["info-circle", false] as const;
      }
    })();
    let node = (
      <div styleName="root">
        <div styleName="head-wrapper">
          <div styleName="icon">
            <Icon name={iconName} slashed={iconSlashed}/>
          </div>
          <div styleName="head-right">
            <div styleName="date">{transDate(notification.date)}</div>
            <h1 styleName="head">
              {fixedNode}
              {notification.title}
            </h1>
          </div>
        </div>
        <Markdown className={styles!["content"]} source={notification.text}/>
      </div>
    );
    return node;

  }
);


export default NotificationPane;