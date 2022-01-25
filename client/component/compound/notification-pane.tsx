//

import * as react from "react";
import {
  ReactElement
} from "react";
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
    let iconString = (() => {
      let type = notification.type;
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